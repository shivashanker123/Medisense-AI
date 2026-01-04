import pandas as pd
import numpy as np
import random
import joblib
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# --- 1. DATA GENERATION (14 Features -> 8 Diseases) ---
def generate_smart_data(n=5000):
    print(f"Generating {n} patient records with Age/Gender logic...")
    data = []
    for _ in range(n):
        # 1. Demographics
        age = np.random.randint(10, 90)
        gender = np.random.randint(0, 2) # 0=Male, 1=Female

        # 2. Baseline Urine (Normal)
        row = {
            'age': age,
            'gender': gender,
            'glucose': 0, 'ketones': 0, 'protein': 0, 
            'blood_rbc': np.random.randint(0, 2), 
            'wbc': np.random.randint(0, 5), 
            'nitrite': 0, 'leukocyte_esterase': 0,
            'ph': round(np.random.uniform(5.0, 7.5), 1),
            'specific_gravity': round(np.random.uniform(1.010, 1.025), 3),
            'bilirubin': 0, 'urobilinogen': 0, 'crystals': 0,
            
            # Targets
            'Kidney_Stone': 0, 'UTI': 0, 'Diabetes': 0, 'Nephritis': 0, 
            'Pyelonephritis': 0, 'CKD': 0, 'Liver_Disease': 0, 'Dehydration': 0
        }

        # --- SMART DISEASE LOGIC ---

        # A. UTI (Common in Females)
        uti_prob = 0.25 if gender == 1 else 0.05
        if random.random() < uti_prob:
            row['UTI'] = 1
            row['wbc'] = np.random.randint(20, 100) # Pus cells
            row['nitrite'] = 1
            row['leukocyte_esterase'] = 1

        # B. CKD (Common in Old Age > 60)
        ckd_prob = 0.3 if age > 60 else 0.02
        if random.random() < ckd_prob:
            row['CKD'] = 1
            row['protein'] = 1
            row['specific_gravity'] = round(np.random.uniform(1.005, 1.010), 3) # Low SG

        # C. Kidney Stones (Any age, slightly more men)
        if random.random() < 0.15:
            row['Kidney_Stone'] = 1
            row['blood_rbc'] = np.random.randint(10, 50)
            row['crystals'] = 1

        # D. Diabetes (High Glucose)
        if random.random() < 0.15:
            row['Diabetes'] = 1
            row['glucose'] = 1
            if random.random() < 0.4: row['ketones'] = 1

        # E. Liver Disease (Bilirubin)
        if random.random() < 0.05:
            row['Liver_Disease'] = 1
            row['bilirubin'] = 1

        # F. Dehydration (Young/Active people or Elderly)
        if random.random() < 0.1:
            row['Dehydration'] = 1
            row['specific_gravity'] = round(np.random.uniform(1.030, 1.040), 3)

        data.append(row)
    return pd.DataFrame(data)

# --- 2. TRAIN ---
def main():
    df = generate_smart_data(5000)
    
    # 14 Features (Added Age & Gender)
    feature_cols = ['age', 'gender', 'glucose', 'ketones', 'protein', 'blood_rbc', 
                    'wbc', 'nitrite', 'leukocyte_esterase', 'ph', 'specific_gravity', 
                    'bilirubin', 'urobilinogen', 'crystals']
    
    X = df[feature_cols]
    y = df.iloc[:, -8:] # Last 8 columns are targets

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Use Random Forest (Robust for mixed data types)
    model = MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42))
    
    print("Training Smart Model...")
    model.fit(X_train, y_train)
    
    pred = model.predict(X_test)
    acc = accuracy_score(y_test, pred)
    print(f"✅ Model Trained! Accuracy: {acc*100:.2f}%")

    joblib.dump(model, "best.pkl")
    print("💾 Saved to 'best.pkl'")

if __name__ == "__main__":
    main()