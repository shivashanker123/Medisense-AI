from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import APIRouter, File, HTTPException, UploadFile

try:
    import tensorflow as tf
    TF_IMPORT_ERROR = None
except Exception as exc:  # noqa: BLE001
    tf = None
    TF_IMPORT_ERROR = exc

try:
    from PIL import Image, UnidentifiedImageError
    PIL_IMPORT_ERROR = None
except Exception as exc:  # noqa: BLE001
    Image = None
    UnidentifiedImageError = OSError
    PIL_IMPORT_ERROR = exc

router = APIRouter(prefix="/heart", tags=["Heart ECG"])

CLASS_LABELS = [
    "Normal (N)",
    "Supraventricular (S)",
    "Ventricular (V)",
    "Fusion (F)",
    "Unknown (Q)",
]
DEFAULT_WINDOW_SIZE = 288  # Matches 0.8s window at 360Hz in testtrain.py

ROOT_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT_DIR / "ecg_model.keras"


def _resolve_window_size(model: Any) -> int:
    shape = model.input_shape
    if isinstance(shape, list):
        shape = shape[0]
    if isinstance(shape, tuple) and len(shape) >= 3 and shape[1] is not None:
        return int(shape[1])
    return DEFAULT_WINDOW_SIZE


def _load_heart_model() -> tuple[tf.keras.Model | None, int]:
    if tf is None:
        print(f"TensorFlow import failed: {TF_IMPORT_ERROR}")
        return None, DEFAULT_WINDOW_SIZE

    if not MODEL_PATH.exists():
        print(f"Heart model not found at: {MODEL_PATH}")
        return None, DEFAULT_WINDOW_SIZE

    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        window_size = _resolve_window_size(model)
        print(f"Heart model loaded from {MODEL_PATH} (window_size={window_size})")
        return model, window_size
    except Exception as exc:  # noqa: BLE001
        print(f"Failed to load heart model: {exc}")
        return None, DEFAULT_WINDOW_SIZE


HEART_MODEL, HEART_WINDOW_SIZE = _load_heart_model()


def _extract_signal_from_processed(image_2d: np.ndarray) -> tuple[np.ndarray, dict[str, float]]:
    h, w = image_2d.shape
    # Use robust threshold to isolate dark ECG trace after grid suppression.
    dark_threshold = np.percentile(image_2d, 12)
    mask = image_2d <= dark_threshold

    y_positions = np.full(w, np.nan, dtype=np.float32)
    for x in range(w):
        ys = np.where(mask[:, x])[0]
        if ys.size > 0:
            # Median is less sensitive than min() to text/markers.
            y_positions[x] = float(np.median(ys))

    valid = np.isfinite(y_positions)
    valid_ratio = float(valid.mean())
    if valid_ratio < 0.25:
        raise HTTPException(
            status_code=422,
            detail=(
                "Unsupported ECG image quality/layout: failed to trace waveform columns. "
                "Upload a single clear rhythm strip with minimal labels."
            ),
        )

    if not np.all(valid):
        idx = np.arange(w, dtype=np.float32)
        y_positions = np.interp(idx, idx[valid], y_positions[valid]).astype(np.float32)

    signal = 1.0 - (y_positions / max(h - 1, 1))
    signal_std = float(np.std(signal))
    signal_range = float(np.max(signal) - np.min(signal))

    if signal_std < 0.008 or signal_range < 0.04:
        raise HTTPException(
            status_code=422,
            detail=(
                "Unsupported ECG image quality/layout: extracted waveform is nearly flat. "
                "Use a higher-contrast ECG image."
            ),
        )

    quality = {
        "valid_column_ratio": valid_ratio,
        "signal_std": signal_std,
        "signal_range": signal_range,
    }
    return signal.astype(np.float32), quality


def _image_to_model_input(file_bytes: bytes, target_len: int) -> tuple[np.ndarray, dict[str, float]]:
    if Image is None:
        raise HTTPException(
            status_code=500,
            detail=f"Pillow is unavailable: {PIL_IMPORT_ERROR}",
        )

    try:
        image_rgb = Image.open(BytesIO(file_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail=f"Invalid ECG image: {exc}") from exc

    rgb = np.asarray(image_rgb, dtype=np.float32)
    gray = np.asarray(image_rgb.convert("L"), dtype=np.float32)
    if gray.size == 0 or gray.shape[0] < 2 or gray.shape[1] < 8:
        raise HTTPException(
            status_code=400,
            detail="Image is too small or empty. Upload a clearer ECG image.",
        )

    # Use lower image band (rhythm strip area) when image is likely multi-lead ECG.
    h, _ = gray.shape
    if h > 500:
        start = int(h * 0.72)
        gray = gray[start:, :]
        rgb = rgb[start:, :, :]

    # Suppress red ECG grid while preserving dark trace.
    grid_suppressed = np.minimum(gray, np.minimum(rgb[:, :, 1], rgb[:, :, 2]))

    signal, quality = _extract_signal_from_processed(grid_suppressed)

    src_idx = np.linspace(0, signal.size - 1, num=signal.size, dtype=np.float32)
    dst_idx = np.linspace(0, signal.size - 1, num=target_len, dtype=np.float32)
    resampled = np.interp(dst_idx, src_idx, signal).astype(np.float32)

    normalized = (resampled - np.mean(resampled)) / (np.std(resampled) + 1e-8)
    return normalized.reshape(1, target_len, 1), quality


@router.get("/health")
def heart_health():
    return {
        "status": "ready" if HEART_MODEL is not None else "model_unavailable",
        "model_path": str(MODEL_PATH),
        "window_size": HEART_WINDOW_SIZE,
        "classes": CLASS_LABELS,
        "tensorflow_error": str(TF_IMPORT_ERROR) if TF_IMPORT_ERROR else None,
        "pillow_error": str(PIL_IMPORT_ERROR) if PIL_IMPORT_ERROR else None,
    }


@router.post("/predict-image")
async def predict_heart_from_image(file: UploadFile = File(...)):
    if HEART_MODEL is None:
        details = ["Heart model not loaded"]
        if TF_IMPORT_ERROR:
            details.append(f"TensorFlow error: {TF_IMPORT_ERROR}")
        if not MODEL_PATH.exists():
            details.append(f"Missing model file: {MODEL_PATH}")
        raise HTTPException(status_code=500, detail=" | ".join(details))

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image uploads are supported for ECG inference.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        model_input, quality = _image_to_model_input(file_bytes, HEART_WINDOW_SIZE)
        probs = HEART_MODEL.predict(model_input, verbose=0)[0]
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    labels = CLASS_LABELS
    if probs.shape[0] != len(CLASS_LABELS):
        labels = [f"class_{idx}" for idx in range(probs.shape[0])]

    top_idx = int(np.argmax(probs))
    prob_map = {labels[idx]: float(probs[idx]) for idx in range(len(labels))}

    return {
        "predicted_class": labels[top_idx],
        "class_index": top_idx,
        "confidence": float(probs[top_idx]),
        "probabilities": prob_map,
        "input_quality": quality,
        "input_note": (
            "Image-derived ECG input is an approximation of the training format "
            "(1D beat windows). Interpret cautiously."
        ),
        "window_size": HEART_WINDOW_SIZE,
        "filename": file.filename,
    }
