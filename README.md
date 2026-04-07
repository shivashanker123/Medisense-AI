# MediSense AI

MediSense AI is a comprehensive AI-powered health diagnostics platform. It provides specialized modules for predicting and analyzing various health conditions using both traditional machine learning models and state-of-the-art vision-language models (LLMs).

## Features

The platform currently supports the following health checkup modules:

### 1. Kidney Health Analysis
- **Predictive Model**: Uses patient data (age, gender, glucose, ketones, etc.) to predict potential kidney-related conditions (e.g., Kidney Stones, UTI, Diabetes, Nephritis, CKD).
- **OCR Integration**: Upload a standard urinalysis report, and via Gemini Vision AI, the platform auto-extracts parameters to fill the diagnostic form automatically.

### 2. Complete Blood Count (CBC) Analysis
- **Predictive Model**: Evaluates CBC parameters (Hb, RBC, WBC, Platelets, etc.) to detect various blood test patterns and anomalies.
- **OCR Integration**: Automatically parses a CBC report image using Gemini Vision AI, bringing the data easily into the application.

### 3. Brain MRI Diagnostics
- **Tumor Detection**: Upload a Brain MRI scan, and the AI (powered by Gemini Vision) directly analyzes the image.
- **Classification**: Accurately classifies the scan into "Glioma Tumor", "Meningioma Tumor", "Pituitary Tumor", or detects "No Tumor", complete with a confidence score.

### 4. Heart ECG Analysis
- **ECG Inference**: Capable of reading electrocardiogram patterns to surface critical heart-related diagnostic markers.

## Project Structure

The project is structured with a decoupled frontend and backend:

- **/Backend**: 
  - A FastAPI application providing endpoints for prediction and inference.
  - Integration with `google-genai` for Gemini Vision API.
  - Pretrained joblib and keras models (`best.pkl`, `cbc_pattern_model.pkl`, `ecg_model.keras`, etc.).
- **/medisense-frontend**: 
  - A modern React web application built securely with Vite.
  - Uses Tailwind CSS and Framer Motion for responsive layouts and premium interactive animations.

## Setup Instructions

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3.9+ (for the backend)
- Gemini API Key (for Vision OCR & MRI tasks)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your environment variables:
   Create a `.env` file in the `Backend` directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the server:
   ```bash
   python app.py
   ```
   *The FastAPI server will start on `http://0.0.0.0:5000`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd medisense-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The React app will typically be served on `http://localhost:5173`.*

## Tech Stack

- **Frontend**: React (Vite), React Router, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Python, FastAPI, Pandas, Scikit-learn, TensorFlow/Keras, Google GenAI SDK.
- **Machine Learning**: Custom Sklearn joblib models, Keras neural networks, Gemini 2.5 Flash Vision API.

---

*Note: MediSense AI is a diagnostic aid tool and should not completely replace professional medical advice.*
