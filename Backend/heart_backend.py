from __future__ import annotations

import asyncio
import json
import os
from io import BytesIO
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from google import genai
import aiohttp

# --- Robust fix for aiohttp 3.11+ breaking changes ---
if not hasattr(aiohttp, "ClientConnectorDNSError"):
    try:
        from aiohttp import client_exceptions
        aiohttp.ClientConnectorDNSError = getattr(client_exceptions, "ClientConnectorDNSError", 
                                                 getattr(client_exceptions, "ClientConnectorError", Exception))
    except ImportError:
        pass
# -----------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

router = APIRouter(prefix="/heart", tags=["Heart ECG"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

CLASS_LABELS = [
    "Normal (N)",
    "Supraventricular (S)",
    "Ventricular (V)",
    "Fusion (F)",
    "Unknown (Q)",
]

HEART_PROMPT = """
You are an expert cardiologist. Analyze the provided ECG image.
Determine the electrical rhythm and classify it strictly into one of the following exact categories:
- Normal (N)
- Supraventricular (S)
- Ventricular (V)
- Fusion (F)
- Unknown (Q)

Also, provide a primary confidence score between 0.0 and 1.0, and a probability distribution across all 5 classes (values between 0.0 and 1.0 adding up to 1.0).

Return ONLY a raw JSON object with the following keys. Do not include markdown formatting or explanations.
{
  "predicted_class": "",
  "confidence": 0.0,
  "probabilities": {
    "Normal (N)": 0.0,
    "Supraventricular (S)": 0.0,
    "Ventricular (V)": 0.0,
    "Fusion (F)": 0.0,
    "Unknown (Q)": 0.0
  }
}
""".strip()


def _clean_json_response(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:-3].strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:-3].strip()
    return json.loads(cleaned)


@router.get("/health")
def heart_health():
    return {
        "status": "ready" if gemini_client is not None else "model_unavailable",
        "classes": CLASS_LABELS,
    }


@router.post("/predict-image")
async def predict_heart_from_image(file: UploadFile = File(...)):
    if not gemini_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image uploads are supported for ECG inference.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        pil_image = Image.open(BytesIO(file_bytes))

        async def _call_gemini():
            return await gemini_client.aio.models.generate_content(
                model='gemini-flash-lite-latest',
                contents=[HEART_PROMPT, pil_image]
            )

        response = await asyncio.wait_for(_call_gemini(), timeout=45.0)
        result = _clean_json_response(response.text)
        
        predicted_class = result.get("predicted_class", "Unknown (Q)")
        confidence = float(result.get("confidence", 0.0))
        probabilities = result.get("probabilities", {})
        
        # Ensure all classes are present
        for label in CLASS_LABELS:
            if label not in probabilities:
                probabilities[label] = 0.0

        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "probabilities": probabilities,
            "filename": file.filename,
        }
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Gemini API timed out. Please try again.")
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"Invalid JSON response from LLM: {exc}") from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Prediction error: {exc}") from exc

