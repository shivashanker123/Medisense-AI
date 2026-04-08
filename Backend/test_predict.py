import joblib
import pandas as pd
import traceback

model = joblib.load('best.pkl')

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
input_row = [25, 0, 0, 0, 0, 0.0, 0.0, 0, 0, 6.0, 1.020, 0, 0, 0]
input_df = pd.DataFrame([input_row], columns=KIDNEY_EXPECTED_COLUMNS)

try:
    pred = model.predict(input_df)
    print("Success:", pred)
except Exception as e:
    print("Error during predict:")
    traceback.print_exc()
