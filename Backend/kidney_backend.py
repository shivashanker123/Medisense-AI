from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app= FastAPI(title="Kidney prediction backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model=joblib.load("best.pkl")
    print("Successfully loaded")
except FileNotFoundError:
    model=None
    print("Model not found")

EXPECTED_COLUMNS= [
    'age', 'gender', 'glucose', 'ketones', 'protein', 'blood_rbc',
    'wbc', 'nitrite', 'leukocyte_esterase', 'ph', 'specific_gravity',
    'bilirubin', 'urobilinogen', 'crystals'
]

DISEASE_LABELS= [
    'Kidney_Stone', 'UTI', 'Diabetes', 'Nephritis',
    'Pyelonephritis', 'CKD', 'Liver_Disease', 'Dehydration'
]

class PredictInput(BaseModel):
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


#ROUTES

@app.get("/")
def health_check():
    return {"status": "API running"}
@app.post("/predict")
def predict(data: PredictInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
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
            data.crystals
        ]

        input_df = pd.DataFrame([input_row], columns=EXPECTED_COLUMNS)
        
        prediction = model.predict(input_df)[0]

        response = {
            DISEASE_LABELS[i]: int(prediction[i])
            for i in range(len(DISEASE_LABELS))
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
