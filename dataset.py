import pandas as pd
import numpy as np
import random

def generate_data(n=1000):
    data = []
    for _ in range(n):
        # 1. Randomize "Normal" ranges first
        row = {
            # --- Chemical Examination (Dipstick) ---
            'glucose': 0, 
            'ketones': 0, 
            'protein': 0, 
            'nitrite': 0, 
            'leukocyte_esterase': 0,
            'ph': round(np.random.uniform(5.0, 7.5), 1),
            'specific_gravity': round(np.random.uniform(1.005, 1.030), 3),
            
            # --- Microscopic Examination ---
            'blood_rbc': np.random.randint(0, 3), 
            'wbc': np.random.randint(0, 5), 
            'crystals': 0, 
            # REMOVED: 'hcg': 0
            
            # --- Targets (The Answers) ---
            'kidney_stone': 0, 
            'uti': 0, 
            'diabetes': 0
            # REMOVED: 'pregnancy': 0
        }

        # 2. Inject Disease Logic
        
        # Diabetes: High Glucose + sometimes Ketones
        if random.random() < 0.2:
            row['diabetes'] = 1
            row['glucose'] = 1
            if random.random() < 0.4: row['ketones'] = 1
            
        # UTI: High WBC + Nitrite + Leukocytes
        if random.random() < 0.2:
            row['uti'] = 1
            row['wbc'] = np.random.randint(15, 100) # High Pus Cells
            row['nitrite'] = 1
            row['leukocyte_esterase'] = 1
            
        # Kidney Stone: Blood + Crystals
        if random.random() < 0.15:
            row['kidney_stone'] = 1
            row['blood_rbc'] = np.random.randint(5, 50) # High Red Blood Cells
            row['crystals'] = 1
            
        # REMOVED: Pregnancy Logic block
            
        data.append(row)
    return pd.DataFrame(data)

# Generate and Save
df = generate_data(1000)
df.to_csv("urine_data.csv", index=False)
print("✅ Generated 1000 samples (Without Pregnancy/HCG)!")
print("Columns:", df.columns.tolist())