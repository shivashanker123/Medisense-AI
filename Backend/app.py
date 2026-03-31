from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np
import base64
import os
import json
import google.generativeai as genai
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv

load_dotenv(override=True)

app = Flask(__name__)
# Enable CORS so your React Frontend (port 5173 or 3000) can talk to this Backend (port 5000)
CORS(app)

# --- NEW: INITIALIZE GEMINI CLIENT ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# --- 1. LOAD THE MODEL ---
try:
    model = joblib.load("best.pkl")
    print("✅ Model Loaded Successfully!")
except FileNotFoundError:
    print("❌ Error: 'best.pkl' not found. Please run 'train_kidney_model.py' first.")
    model = None

# --- 2. DEFINE EXACT COLUMN ORDER ---
EXPECTED_COLUMNS = [
    'age', 'gender', 'glucose', 'ketones', 'protein', 'blood_rbc', 
    'wbc', 'nitrite', 'leukocyte_esterase', 'ph', 'specific_gravity', 
    'bilirubin', 'urobilinogen', 'crystals'
]

# --- 3. DEFINE OUTPUT LABELS ---
DISEASE_LABELS = [
    'Kidney_Stone', 'UTI', 'Diabetes', 'Nephritis', 
    'Pyelonephritis', 'CKD', 'Liver_Disease', 'Dehydration'
]


# ==========================================
# NEW ROUTE: EXTRACT DATA FROM IMAGE VIA GEMINI
# ==========================================
@app.route('/upload-report', methods=['POST'])
def upload_report():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        print(f"📸 Received image for extraction: {file.filename}")
        
        # 1. Read the image and open it with PIL for Gemini
        image_bytes = file.read()
        pil_image = Image.open(BytesIO(image_bytes))

        # 2. Define the exact JSON structure we want Gemini to return
        prompt_text = """
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
        """

        # 3. Call the Gemini Vision API
        # Using gemini-2.5-flash as it is fast and excellent at OCR
        vision_model = genai.GenerativeModel('gemini-2.5-flash')
        response = vision_model.generate_content([prompt_text, pil_image])

        # 4. Clean and parse the response
        response_text = response.text.strip()
        
        # Sometimes LLMs wrap JSON in markdown block. Strip it out if present.
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()

        print(f"🤖 Gemini Output: {response_text}")
        
        # Convert string to dictionary and send back to React
        extracted_data = json.loads(response_text)
        return jsonify(extracted_data)

    except Exception as e:
        print(f"❌ Extraction Error: {e}")
        return jsonify({'error': str(e)}), 500


# ==========================================
# EXISTING ROUTE: PREDICT DISEASE
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        print(f"📥 Received Payload: {data}")

        gender_input = data.get('gender', 'Male')
        gender_val = 1 if gender_input == 'Female' else 0

        input_list = [
            int(data.get('age', 25)),           # Age
            gender_val,                         # Gender 
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

        input_df = pd.DataFrame([input_list], columns=EXPECTED_COLUMNS)
        prediction_raw = model.predict(input_df)
        patient_result = prediction_raw[0] 

        response_data = {}
        for i, disease_name in enumerate(DISEASE_LABELS):
            response_data[disease_name] = int(patient_result[i])

        print(f"📤 Sending Response: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask Server on Port 5000...")
    app.run(debug=True, port=5000)