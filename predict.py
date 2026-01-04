import joblib
import pandas as pd
import sys

# --- 1. Define Helper Function to Translate Inputs ---
def get_user_input(prompt, input_type="float"):
    """
    Prompts the user and converts their text answer into the correct number.
    Handles 'Positive', 'Negative', 'Trace', '+', etc.
    """
    while True:
        user_text = input(prompt + ": ").strip().lower()
        
        if user_text == 'exit':
            print("Exiting...")
            sys.exit()

        # LOGIC FOR TRUE/FALSE FIELDS (Glucose, Nitrite, etc.)
        if input_type == "binary":
            # Map common words to 0 or 1
            if user_text in ['0', 'negative', 'neg', '-', 'no', 'absent', 'normal']:
                return 0
            elif user_text in ['1', 'positive', 'pos', '+', '++', '+++', 'yes', 'present', 'trace', 'high']:
                return 1
            else:
                print("   ❌ I didn't understand. Try 'Positive', 'Negative', 'Yes', or 'No'.")

        # LOGIC FOR NUMERICAL FIELDS (pH, WBC, etc.)
        elif input_type == "float":
            try:
                return float(user_text)
            except ValueError:
                print("   ❌ Please enter a valid number (e.g., 5.0, 25).")

# --- 2. Main Prediction Application ---
def interactive_prediction():
    # Load Model
    try:
        model = joblib.load("urine_model.pkl")
        print("✅ Model loaded successfully!")
    except FileNotFoundError:
        print("❌ Error: 'urine_model.pkl' not found. Run 'mlurine.py' first to train the model.")
        return

    print("\n🏥 --- SMART KIDNEY & METABOLIC ANALYZER --- 🏥")
    print("Answer the questions using medical terms (Positive/Negative) or numbers.")
    print("Type 'exit' to quit.\n")

    # Updated list of diseases (Removed Pregnancy)
    diseases = ["Kidney Stone", "UTI", "Diabetes"]

    while True:
        print("-" * 40)
        
        # We collect data in the specific order the model was trained on
        # [glucose, ketones, protein, nitrite, leukocyte_esterase, ph, specific_gravity, blood_rbc, wbc, crystals]
        
        patient_data = []

        print("\n--- CHEMICAL EXAMINATION (DIPSTICK) ---")
        
        # 1. Glucose (Binary)
        patient_data.append(get_user_input("Glucose (Sugar)", "binary"))
        
        # 2. Ketones (Binary)
        patient_data.append(get_user_input("Ketones", "binary"))
        
        # 3. Protein (Binary)
        patient_data.append(get_user_input("Protein", "binary"))
        
        # 4. Nitrite (Binary)
        patient_data.append(get_user_input("Nitrite", "binary"))

        # 5. Leukocyte Esterase (Binary)
        patient_data.append(get_user_input("Leukocyte Esterase", "binary"))
        
        # 6. pH (Numerical)
        patient_data.append(get_user_input("pH Level (e.g. 5.0 - 8.5)"))

        # 7. Specific Gravity (Numerical)
        patient_data.append(get_user_input("Specific Gravity (e.g. 1.005 - 1.030)"))

        print("\n--- MICROSCOPIC EXAMINATION ---")

        # 8. Blood RBC (Numerical Count)
        rbc_input = input("Blood RBC (Count or 'Negative'): ").strip().lower()
        if rbc_input in ['negative', 'neg', 'no', '-', 'nil']:
            patient_data.append(0)
        else:
            try:
                patient_data.append(float(rbc_input))
            except:
                 patient_data.append(5) # Fallback if unknown
        
        # 9. WBC (Numerical Count)
        wbc_input = input("Pus Cells / WBC (Count or 'Negative'): ").strip().lower()
        if wbc_input in ['negative', 'neg', 'no', '-', 'nil']:
             patient_data.append(0)
        else:
             try:
                patient_data.append(float(wbc_input))
             except:
                patient_data.append(10) # Fallback

        # 10. Crystals (Binary)
        patient_data.append(get_user_input("Crystals", "binary"))

        # --- PREDICTION ---
        # Note: The column order MUST match the dataset.py 'row' dictionary order exactly.
        # Based on your last request: Chemical inputs first, then Microscopic.
        columns = [
            'glucose', 'ketones', 'protein', 'nitrite', 
            'leukocyte_esterase', 'ph', 'specific_gravity', 
            'blood_rbc', 'wbc', 'crystals'
        ]
        
        input_df = pd.DataFrame([patient_data], columns=columns)

        try:
            pred = model.predict(input_df)
            results = pred[0]
            
            print("\n📋 --- DIAGNOSIS REPORT ---")
            found_issue = False
            for i, disease in enumerate(diseases):
                if results[i] == 1:
                    print(f"⚠️  POSITIVE for: {disease.upper()}")
                    found_issue = True
            
            if not found_issue:
                print("✅  All tests NEGATIVE (Healthy)")
                
        except Exception as e:
            print(f"Error during prediction: {e}")
            print("Tip: Check if 'dataset.py' column order matches 'predict.py'.")

        print("\nNext patient...")

if __name__ == "__main__":
    interactive_prediction()