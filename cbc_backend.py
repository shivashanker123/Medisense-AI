from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="CBC Pattern Prediction Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = joblib.load("cbc_pattern_model.pkl")
    label_encoder = joblib.load("cbc_label_encoder.pkl")
    print("✅ CBC Model & Label Encoder loaded successfully")
except FileNotFoundError:
    model = None
    label_encoder = None
    print("❌ Error: Model files not found. Run 'CBCTrain.py' first.")

class CBCInput(BaseModel):
    age: int = 30           
    gender: str = "Male"    
    Hb: float = 13.5
    RBC: float = 4.8
    WBC: float = 7500.0
    PLATELETS: float = 250000.0
    LYMP: float = 30.0
    MONO: float = 5.0
    HCT: float = 40.0
    MCV: float = 90.0
    MCH: float = 30.0
    MCHC: float = 33.0
    RDW: float = 13.0
    PDW: float = 12.0
    MPV: float = 9.0
    PCT: float = 0.25

@app.get("/blood-checkup")
def health_check():
    return {"status": "CBC API is running"}

@app.post("/")
def predict(data: CBCInput):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model files are missing")

    try:
        
        features = [
            data.Hb, data.RBC, data.WBC, data.PLATELETS,
            data.LYMP, data.MONO, data.HCT, data.MCV,
            data.MCH, data.MCHC, data.RDW, data.PDW,
            data.MPV, data.PCT
        ]
        
        cols = [
            "Hb", "RBC", "WBC", "PLATELETS",
            "LYMP", "MONO", "HCT", "MCV",
            "MCH", "MCHC", "RDW", "PDW",
            "MPV", "PCT"
        ]
        
        input_df = pd.DataFrame([features], columns=cols)
        
        prediction_index = model.predict(input_df)[0]
        
        prediction_name = label_encoder.inverse_transform([prediction_index])[0]
        
        return {
            "status": "success",
            "prediction": prediction_name,
            "input_received": data.dict()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))