from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)
# Enable CORS so your React Frontend (port 5173) can talk to this Backend (port 5000)
CORS(app)

# --- 1. LOAD THE MODEL ---
try:
    model = joblib.load("best.pkl")
    print("✅ Model Loaded Successfully!")
except FileNotFoundError:
    print("❌ Error: 'best.pkl' not found. Please run 'train_kidney_model.py' first.")
    model = None

# --- 2. DEFINE EXACT COLUMN ORDER ---
# This MUST match the order in 'train_kidney_model.py' exactly.
# If these are swapped, the model will think Age is Glucose!
EXPECTED_COLUMNS = [
    'age', 'gender', 'glucose', 'ketones', 'protein', 'blood_rbc', 
    'wbc', 'nitrite', 'leukocyte_esterase', 'ph', 'specific_gravity', 
    'bilirubin', 'urobilinogen', 'crystals'
]

# --- 3. DEFINE OUTPUT LABELS ---
# The model outputs [0, 1, 0...]. We need to know which index matches which disease.
DISEASE_LABELS = [
    'Kidney_Stone', 'UTI', 'Diabetes', 'Nephritis', 
    'Pyelonephritis', 'CKD', 'Liver_Disease', 'Dehydration'
]

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        # --- STEP 1: RECEIVE JSON FROM FRONTEND ---
        # Data comes in looking like: {'name': 'John', 'age': '25', 'gender': 'Male', 'glucose': '1'...}
        data = request.json
        print(f"📥 Received Payload: {data}")

        # --- STEP 2: PRE-PROCESSING (Translate Human -> Machine) ---
        
        # A. Handle Gender: Model trained on 0=Male, 1=Female
        # Frontend sends "Male"/"Female"
        gender_input = data.get('gender', 'Male')
        gender_val = 1 if gender_input == 'Female' else 0

        # B. Organize into a List in the EXACT order required
        input_list = [
            int(data.get('age', 25)),           # Age
            gender_val,                         # Gender (converted)
            int(data.get('glucose', 0)),        # Glucose
            int(data.get('ketones', 0)),        # Ketones
            int(data.get('protein', 0)),        # Protein
            float(data.get('blood_rbc', 0)),    # Blood
            float(data.get('wbc', 0)),          # WBC
            int(data.get('nitrite', 0)),        # Nitrite
            int(data.get('leukocyte_esterase', 0)), # Leukocytes
            float(data.get('ph', 6.0)),         # pH
            float(data.get('specific_gravity', 1.020)), # SG
            int(data.get('bilirubin', 0)),      # Bilirubin
            int(data.get('urobilinogen', 0)),   # Urobilinogen
            int(data.get('crystals', 0))        # Crystals
        ]

        # --- STEP 3: CONVERT TO DATAFRAME ---
        # We wrap the list in a DataFrame so it looks just like the training data
        input_df = pd.DataFrame([input_list], columns=EXPECTED_COLUMNS)

        # --- STEP 4: GET PREDICTION FROM MODEL ---
        # The model returns a NumPy array like: [[0, 1, 0, 0, 0, 0, 0, 0]]
        prediction_raw = model.predict(input_df)
        
        # We take the first row (since we only predicted 1 patient)
        patient_result = prediction_raw[0] 

        # --- STEP 5: CONVERT ARRAY TO JSON ---
        # We assume integers (0 or 1) because JSON doesn't like NumPy types
        response_data = {}
        for i, disease_name in enumerate(DISEASE_LABELS):
            response_data[disease_name] = int(patient_result[i])

        # Result looks like: {"Kidney_Stone": 0, "UTI": 1, ...}
        print(f"📤 Sending Response: {response_data}")
        
        return jsonify(response_data)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask Server on Port 5000...")
    app.run(debug=True, port=5000)