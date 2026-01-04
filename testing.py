import pandas as pd
import joblib
from sklearn.metrics import accuracy_score

# --- 1. Load the Best Model ---
# Note: We look for 'urine_model.pkl' because that is what mlurine.py saves now.
try:
    model = joblib.load("urine_model.pkl")
    print("✅ Loaded 'urine_model.pkl'")
except FileNotFoundError:
    print("❌ Model not found! Please run 'mlurine.py' first to train the model.")
    exit()

# --- 2. Load YOUR Test Data ---
try:
    # Ensure this matches your uploaded filename exactly
    df_test = pd.read_csv("urine_data.csv")
    print(f"✅ Loaded 'urine_data.csv' with {len(df_test)} rows.")
except FileNotFoundError:
    print("❌ 'urine_data.csv' not found.")
    exit()

# --- 3. Separate Features and Targets ---
# IMPORTANT CHANGE: 
# We used to have 4 diseases, now we have 3.
# So we slice the last 3 columns instead of 4.
X_test = df_test.iloc[:, :-3] # All columns except last 3
y_true = df_test.iloc[:, -3:] # The actual answers (Kidney Stone, UTI, Diabetes)

# --- 4. Predict using the Model ---
try:
    predictions = model.predict(X_test)
    y_pred = pd.DataFrame(predictions, columns=y_true.columns)
except ValueError as e:
    print(f"\n❌ ERROR: Dimension mismatch. {e}")
    print("Tip: Did you regenerate 'urine_data.csv' using the new dataset.py?")
    exit()

# --- 5. Show Side-by-Side Comparison ---
print("\n" + "="*50)
print(" COMPARISON: REAL DIAGNOSIS vs AI PREDICTION")
print("="*50)

# Limit to first 20 rows so terminal doesn't explode, 
# or remove [:20] to see all 1000.
for i in range(min(len(df_test), 20)): 
    
    # Check each condition
    matches = True
    row_result = []
    
    for col in y_true.columns:
        actual = y_true.iloc[i][col]
        predicted = int(y_pred.iloc[i][col]) # Ensure it's an integer
        
        # Logic to display only relevant info
        if actual == 1 or predicted == 1:
            status = "✅" if actual == predicted else "❌ MISSED"
            row_result.append(f"{col.upper()}: Real={actual} Pred={predicted} {status}")
            if actual != predicted:
                matches = False

    # Only print if there is something interesting (sick patient or wrong prediction)
    if row_result:
        print(f"\nPatient {i+1}:")
        for res in row_result:
            print(f"  {res}")
    else:
        # Optional: Print healthy patients casually
        # print(f"Patient {i+1}: Healthy (Correct)")
        pass

print("\n" + "="*50)
print("Test Complete.")