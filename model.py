# ---import used libraries---
import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix,
    precision_score,
    recall_score,
)
from sklearn.utils import resample
import joblib
import json
import numpy as np

# --- Load dataset ---
df = pd.read_csv("spam_updated.csv")

# --- Standardize column names ---
df.columns = df.columns.str.strip().str.lower()

# --- Encode labels ---
df['label'] = df['category'].map({'ham': 0, 'spam': 1})

# --- Text cleaning function ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)  
    text = re.sub(r'\d+', '', text)                      
    text = re.sub(r'[^\w\s]', '', text)                  
    text = re.sub(r'\s+', ' ', text).strip()             
    return text

df['message'] = df['message'].apply(clean_text)

# --- Handle imbalance ---
ham = df[df['label'] == 0]
spam = df[df['label'] == 1]

spam_upsampled = resample(         
    spam,
    replace=True,
    n_samples=len(ham),
    random_state=42
)

df_balanced = pd.concat([ham, spam_upsampled])
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

# --- Features and labels ---
X = df_balanced['message']
y = df_balanced['label']

# --- Vectorization ---
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_features=10000,
    ngram_range=(1, 2)
)
X_vec = vectorizer.fit_transform(X)

# --- Stratified split ---
X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y, test_size=0.2, random_state=42, stratify=y
)

# --- Train Random Forest ---
model = RandomForestClassifier(
    n_estimators=500,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight='balanced_subsample',
    random_state=42
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

# --- Evaluation metrics ---
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

print("\n Accuracy:", accuracy)
print(" Precision:", precision)
print(" Recall:", recall)

print("\n📈 Classification Report:")
print(classification_report(y_test, y_pred))

# --- Confusion Matrix ---
print("\n Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# --- Save model and vectorizer ---
joblib.dump(model, "spam_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

# --- Save metadata (including metrics) ---
metadata = {
    "vectorizer_features": len(vectorizer.get_feature_names_out()),
    "class_distribution": {
        "ham": int(df_balanced['label'].value_counts()[0]),
        "spam": int(df_balanced['label'].value_counts()[1])
    },
    "evaluation_metrics": {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
    }
}
with open("spam_metadata.json", "w") as f:
    json.dump(metadata, f, indent=4)

print("\n Model training complete. Files saved:")
print("   - spam_model.pkl")
print("   - vectorizer.pkl")
print("   - spam_metadata.json")        

