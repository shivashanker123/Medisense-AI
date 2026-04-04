from __future__ import annotations

import json
import os
from io import BytesIO
from pathlib import Path
from typing import Any

from google import genai
import joblib
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, UnidentifiedImageError

from heart_backend import router as heart_router


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
load_dotenv(BASE_DIR / ".env", override=True)

KIDNEY_MODEL_PATH = BASE_DIR / "best.pkl"
CBC_MODEL_PATH = BASE_DIR / "cbc_pattern_model.pkl"
CBC_ENCODER_PATH = BASE_DIR / "cbc_label_encoder.pkl"

KIDNEY_EXPECTED_COLUMNS = [
    "age",
    "gender",
    "glucose",
    "ketones",
    "protein",
    "blood_rbc",
    "wbc",
    "nitrite",
    "leukocyte_esterase",
    "ph",
    "specific_gravity",
    "bilirubin",
    "urobilinogen",
    "crystals",
]

DISEASE_LABELS = [
    "Kidney_Stone",
    "UTI",
    "Diabetes",
    "Nephritis",
    "Pyelonephritis",
    "CKD",
    "Liver_Disease",
    "Dehydration",
]

CBC_EXPECTED_COLUMNS = [
    "Hb",
    "RBC",
    "WBC",
    "PLATELETS",
    "LYMP",
    "MONO",
    "HCT",
    "MCV",
    "MCH",
    "MCHC",
    "RDW",
    "PDW",
    "MPV",
    "PCT",
]

KIDNEY_OCR_PROMPT = """
You are an expert medical data extractor. Analyze the provided urinalysis report image.
Extract the values and return ONLY a raw JSON object. Do not include markdown formatting or explanations.

Rules for values:
- For 'ph', 'specific_gravity', 'wbc', 'blood_rbc': Return the exact number as a string (e.g., "6.5", "1.020", "25").
- For all other fields (glucose, ketones, protein, nitrite, leukocyte_esterase, bilirubin, urobilinogen, crystals):
  Return "1" if the report indicates Positive/Trace/Present/Abnormal. Return "0" if Negative/Normal/Absent/Nil.
- If a field is not found in the image, return "".

Required JSON keys:
{
  "glucose": "", "ketones": "", "protein": "", "blood_rbc": "",
  "wbc": "", "nitrite": "", "leukocyte_esterase": "", "ph": "",
  "specific_gravity": "", "bilirubin": "", "urobilinogen": "", "crystals": ""
}
""".strip()

CBC_OCR_PROMPT = """
You are an expert medical data extractor. Analyze the provided Complete Blood Count (CBC) report image.
Extract the numerical values for the specific tests listed below and return ONLY a raw JSON object.
Do not include markdown formatting, explanations, or units (like g/dL or %). Only return the numbers as strings.

If a field is not found in the image, return "0.0".

Required JSON keys:
{
  "Hb": "", "RBC": "", "WBC": "", "PLATELETS": "",
  "LYMP": "", "MONO": "", "HCT": "", "MCV": "",
  "MCH": "", "MCHC": "", "RDW": "", "PDW": "",
  "MPV": "", "PCT": ""
}
""".strip()

app = FastAPI(
    title="MediSense AI Backend",
    description="Backend for kidney, CBC, and ECG analysis",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(heart_router)


class KidneyInput(BaseModel):
    age: int = 25
    gender: str = "Male"
    glucose: int = 0
    ketones: int = 0
    protein: int = 0
    blood_rbc: float = 0.0
    wbc: float = 0.0
    nitrite: int = 0
    leukocyte_esterase: int = 0
    ph: float = 6.0
    specific_gravity: float = 1.020
    bilirubin: int = 0
    urobilinogen: int = 0
    crystals: int = 0


class CBCInput(BaseModel):
    Hb: float = 0.0
    RBC: float = 0.0
    WBC: float = 0.0
    PLATELETS: float = 0.0
    LYMP: float = 0.0
    MONO: float = 0.0
    HCT: float = 0.0
    MCV: float = 0.0
    MCH: float = 0.0
    MCHC: float = 0.0
    RDW: float = 0.0
    PDW: float = 0.0
    MPV: float = 0.0
    PCT: float = 0.0


def _load_joblib_model(path: Path, label: str) -> Any | None:
    try:
        model = joblib.load(path)
        print(f"{label} loaded from {path}")
        return model
    except FileNotFoundError:
        print(f"{label} not found at {path}")
        return None
    except Exception as exc:  # noqa: BLE001
        print(f"Failed to load {label}: {exc}")
        return None


def _clean_json_response(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:-3].strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:-3].strip()
    return json.loads(cleaned)


def _ensure_image_upload(file: UploadFile) -> None:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")


async def _extract_report_data(file: UploadFile, prompt_text: str) -> dict[str, Any]:
    _ensure_image_upload(file)

    if not gemini_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        pil_image = Image.open(BytesIO(image_bytes))
        response = await gemini_client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt_text, pil_image]
        )
        return _clean_json_response(response.text)
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"Invalid OCR JSON response: {exc}") from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Extraction error: {exc}") from exc


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("GEMINI_API_KEY not found in environment variables.")

kidney_model = _load_joblib_model(KIDNEY_MODEL_PATH, "Kidney model")
cbc_model = _load_joblib_model(CBC_MODEL_PATH, "CBC model")
cbc_label_encoder = _load_joblib_model(CBC_ENCODER_PATH, "CBC label encoder")


@app.get("/")
def health_check() -> dict[str, Any]:
    return {
        "status": "MediSense API is running",
        "gemini_configured": bool(GEMINI_API_KEY),
        "kidney_model_loaded": kidney_model is not None,
        "cbc_model_loaded": cbc_model is not None and cbc_label_encoder is not None,
    }


@app.post("/predict")
def predict_kidney(data: KidneyInput) -> dict[str, int]:
    if kidney_model is None:
        raise HTTPException(status_code=500, detail="Kidney model not loaded.")

    try:
        gender_val = 1 if data.gender.lower() == "female" else 0
        input_row = [
            data.age,
            gender_val,
            data.glucose,
            data.ketones,
            data.protein,
            data.blood_rbc,
            data.wbc,
            data.nitrite,
            data.leukocyte_esterase,
            data.ph,
            data.specific_gravity,
            data.bilirubin,
            data.urobilinogen,
            data.crystals,
        ]

        input_df = pd.DataFrame([input_row], columns=KIDNEY_EXPECTED_COLUMNS)
        prediction_raw = kidney_model.predict(input_df)[0]
        return {
            DISEASE_LABELS[i]: int(prediction_raw[i])
            for i in range(len(DISEASE_LABELS))
        }
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/upload-report")
async def upload_urinalysis_report(file: UploadFile = File(...)) -> dict[str, Any]:
    return await _extract_report_data(file, KIDNEY_OCR_PROMPT)


@app.post("/predict-cbc")
def predict_cbc(data: CBCInput) -> dict[str, str]:
    if cbc_model is None or cbc_label_encoder is None:
        raise HTTPException(status_code=500, detail="CBC models not loaded.")

    try:
        if hasattr(data, "model_dump"):
            input_data = data.model_dump()
        else:
            input_data = data.dict()

        input_row = [input_data[column] for column in CBC_EXPECTED_COLUMNS]
        input_df = pd.DataFrame([input_row], columns=CBC_EXPECTED_COLUMNS)

        prediction = cbc_model.predict(input_df)[0]
        pattern = cbc_label_encoder.inverse_transform([prediction])[0]
        return {"pattern": str(pattern)}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/upload-cbc-report")
async def upload_cbc_report(file: UploadFile = File(...)) -> dict[str, Any]:
    return await _extract_report_data(file, CBC_OCR_PROMPT)


if __name__ == "__main__":
    import uvicorn

    print("Starting FastAPI server on port 5000...")
    uvicorn.run(app, host="0.0.0.0", port=5000)
