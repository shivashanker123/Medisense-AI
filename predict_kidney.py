import joblib
import pandas as pd
import sys

def get_input(prompt, type_="float"):
    while True:
        val = input(f"{prompt}: ").strip().lower()
        if val == 'exit': sys.exit()
        
        if type_ == "binary":
            if val in ['1', 'pos', 'positive', '+', 'yes', 'present', 'high']: return 1
            if val in ['0', 'neg', 'negative', '-', 'no', 'absent', 'normal', 'low']: return 0
        elif type_ == "gender":
            if val in ['m', 'male', 'man', 'boy']: return 0
            if val in ['f', 'female', 'woman', 'girl']: return 1
        else:
            try: return float(val)
            except: pass
        print("❌ Invalid input. Try again.")

def run():
    try:
        model = joblib.load("best.pkl")
        print("✅ Model Loaded (Expects Age/Gender + 12 Tests)!")
    except:
        print("❌ 'best.pkl' not found. Run training script first.")
        return

    # UPDATED: Added 'age' and 'gender' to the start
    cols = ['age', 'gender', 'glucose', 'ketones', 'protein', 'blood_rbc', 
            'wbc', 'nitrite', 'leukocyte_esterase', 'ph', 'specific_gravity', 
            'bilirubin', 'urobilinogen', 'crystals']
    
    diseases = ['Kidney_Stone', 'UTI', 'Diabetes', 'Nephritis', 'Pyelonephritis', 
                'CKD', 'Liver_Disease', 'Dehydration']

    print("\n--- 🏥 FULL DIAGNOSTIC PANEL (WITH DEMOGRAPHICS) 🏥 ---")

    while True:
        print("-" * 30)
        row = []
        
        # --- NEW: DEMOGRAPHICS ---
        row.append(get_input("Age", "float"))
        row.append(get_input("Gender (Male/Female)", "gender"))

        # --- 1. Chemical Strip ---
        row.append(get_input("Glucose", "binary"))
        row.append(get_input("Ketones", "binary"))
        row.append(get_input("Protein", "binary"))
        row.append(get_input("Blood (RBC Count)", "float"))
        row.append(get_input("WBC (Count)", "float"))
        row.append(get_input("Nitrite", "binary"))
        row.append(get_input("Leukocytes", "binary"))
        row.append(get_input("pH", "float"))
        row.append(get_input("Specific Gravity", "float"))
        
        # --- 2. Liver ---
        row.append(get_input("Bilirubin", "binary"))
        row.append(get_input("Urobilinogen", "binary"))
        
        # --- 3. Microscopic ---
        row.append(get_input("Crystals", "binary"))

        # Predict
        input_df = pd.DataFrame([row], columns=cols)
        pred = model.predict(input_df)[0]
        
        print("\n📋 --- RESULT ---")
        found = [diseases[i] for i, x in enumerate(pred) if x == 1]
        
        if found:
            print(f"⚠️  POSSIBLE: {', '.join(found)}")
        else:
            print("✅  Healthy")
        print("\nNext...")

if __name__ == "__main__":
    run()