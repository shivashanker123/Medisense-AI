import joblib
import pandas as pd
import sys

def get_input(prompt):
    while True:
        val = input(f"{prompt}: ").strip().lower()
        if val == "exit":
            sys.exit()
        try:
            return float(val)
        except:
            print("❌ Invalid input. Enter a number or type 'exit'.")

def run():
    try:
        model = joblib.load("cbc_pattern_model.pkl")
        le = joblib.load("cbc_label_encoder.pkl")
        print("✅ CBC Pattern Model Loaded")
    except:
        print("❌ Model files not found. Train CBC model first.")
        return

    cols = [
        "Hb", "RBC", "WBC", "PLATELETS",
        "LYMP", "MONO", "HCT", "MCV",
        "MCH", "MCHC", "RDW", "PDW",
        "MPV", "PCT"
    ]

    print("\n--- 🧪 CBC PATTERN ANALYSIS (Type 'exit' anytime) ---")

    while True:
        print("\n" + "-" * 40)
        row = []

        for col in cols:
            row.append(get_input(col))

        df = pd.DataFrame([row], columns=cols)

        pred = model.predict(df)[0]
        pattern = le.inverse_transform([pred])[0]

        print("\n🩸 DETECTED CBC PATTERN:")
        print("➡", pattern)

        print("\n⚠️ NOTE:")
        print("This is a hematological pattern, not a diagnosis.")

if __name__ == "__main__":
    run()