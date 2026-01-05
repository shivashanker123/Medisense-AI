import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

from lightgbm import LGBMClassifier

df = pd.read_csv("BDCBC7196_Hematology_Dataset.csv")
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]
df = df.dropna()
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

FEATURES = [
    "Hb", "RBC", "WBC", "PLATELETS",
    "LYMP", "MONO", "HCT", "MCV",
    "MCH", "MCHC", "RDW", "PDW",
    "MPV", "PCT"
]

X = df[FEATURES]

def cbc_pattern(row):
    if row["Hb"] < 12:
        if row["MCV"] < 80:
            return "Anemia_Microcytic"
        elif 80 <= row["MCV"] <= 100:
            return "Anemia_Normocytic"
        else:
            return "Anemia_Macrocytic"
    if row["PLATELETS"] < 150000:
        return "Thrombocytopenia"
    elif row["PLATELETS"] > 450000:
        return "Thrombocytosis"
    if row["WBC"] < 4000 and row["LYMP"] > 40:
        return "Viral_Pattern"
    elif row["WBC"] > 11000 and row["LYMP"] < 40:
        return "Bacterial_Pattern"
    return "Normal_CBC"

df["Pattern"] = df.apply(cbc_pattern, axis=1)

le = LabelEncoder()
y = le.fit_transform(df["Pattern"])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = LGBMClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    num_leaves=63,
    objective="multiclass",
    random_state=42,
    verbose=-1
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("CBC Pattern Model Accuracy:", accuracy)

joblib.dump(model, "cbc_pattern_model.pkl")
joblib.dump(le, "cbc_label_encoder.pkl")
