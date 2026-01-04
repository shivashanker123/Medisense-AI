import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import joblib  # For saving the model

# --- 1. Load Data ---
try:
    data = pd.read_csv("urine_data.csv")
    print(f"✅ Loaded Data. Columns found: {data.columns.tolist()}")
except FileNotFoundError:
    print("❌ 'urine_data.csv' not found. Please run dataset.py first.")
    exit()

# --- 2. Separate Input (X) and Output (y) ---
# ADJUSTMENT: Now we only have 3 diseases (Kidney Stone, UTI, Diabetes)
# So we take the last 3 columns as Targets.
X = data.iloc[:, :-3]  # All columns except last 3
y = data.iloc[:, -3:]  # Last 3 columns

print(f"Features (X): {X.columns.tolist()}")
print(f"Targets (y): {y.columns.tolist()}")

# --- 3. Train/Test Split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --- 4. Model Setup ---
xgb = XGBClassifier(
    objective="binary:logistic",
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42
)

model = MultiOutputClassifier(xgb)

print("\nTraining model...")
model.fit(X_train, y_train)
print("Done.")

# --- 5. Evaluation ---
pred = model.predict(X_test)
print("\n--- Model Accuracy per Condition ---")
for i, column in enumerate(y.columns):
    acc = accuracy_score(y_test.iloc[:, i], pred[:, i])
    print(f"{column}: {acc*100:.2f}%")

# --- 6. Save Model ---
joblib.dump(model, "urine_model.pkl")
print("\nModel saved as 'urine_model.pkl'")

# --- 7. Prediction Function for New Patients ---
def predict_patient(inputs):
    """
    inputs: list of 10 values in the EXACT order of the CSV columns.
    Based on your new dataset.py, the order is:
    [glucose, ketones, protein, nitrite, leukocyte, ph, specific_gravity, blood_rbc, wbc, crystals]
    """
    col_names = X.columns
    
    # Safety Check
    if len(inputs) != len(col_names):
        print(f"❌ Error: Expected {len(col_names)} inputs, but got {len(inputs)}.")
        return []

    input_df = pd.DataFrame([inputs], columns=col_names)
    
    prediction = model.predict(input_df)
    
    # Format output
    diseases = y.columns
    result = []
    for i, disease in enumerate(diseases):
        if prediction[0][i] == 1:
            result.append(disease.upper())
            
    return result if result else ["HEALTHY"]

# --- Example Usage ---
print("\n--- TEST SAMPLE RESULT ---")

# Example: Patient with UTI Symptoms (High Nitrite, High Leukocytes, High WBC)
# Order: [Glu, Ket, Pro, Nit, Leuk, pH, SG, Blood, WBC, Crys]
new_patient = [0, 0, 0, 1, 1, 7.0, 1.020, 0, 50, 0]

diagnosis = predict_patient(new_patient)
print(f"Patient Inputs: {new_patient}")
print(f"Model Diagnosis: {diagnosis}")