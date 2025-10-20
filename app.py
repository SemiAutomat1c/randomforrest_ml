from flask import Flask, render_template, request, jsonify
import joblib
import os

app = Flask(__name__)

# Load model and vectorizer
model = None
vectorizer = None

def load_model():
    global model, vectorizer
    if model is None or vectorizer is None:
        try:
            # Try loading from current directory
            model_path = "spam_model.pkl"
            vectorizer_path = "vectorizer.pkl"
            
            # Check if files exist
            if os.path.exists(model_path) and os.path.exists(vectorizer_path):
                model = joblib.load(model_path)
                vectorizer = joblib.load(vectorizer_path)
                print("✅ Model and vectorizer loaded successfully.")
            else:
                print("❌ Model files not found")
        except Exception as e:
            print("❌ Error loading model or vectorizer:", e)

# Try to load on startup
load_model()


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None or vectorizer is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()
        message = data.get("message", "")

        if not message.strip():
            return jsonify({"error": "Empty message"}), 400

        message_vec = vectorizer.transform([message])

        prediction = model.predict(message_vec)[0]
        label = "Spam" if prediction == 1 else "Not Spam"

        return jsonify({"prediction": label})
    except Exception as e:
        print("❌ Prediction error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/predict-batch", methods=["POST"])
def predict_batch():
    try:
        if model is None or vectorizer is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()
        messages = data.get("messages", [])

        if not messages or len(messages) == 0:
            return jsonify({"error": "No messages provided"}), 400

        # Filter out empty messages
        messages = [msg.strip() for msg in messages if msg.strip()]
        
        if len(messages) == 0:
            return jsonify({"error": "All messages are empty"}), 400

        # Vectorize all messages at once (more efficient)
        messages_vec = vectorizer.transform(messages)

        # Predict all at once
        predictions = model.predict(messages_vec)
        
        # Convert predictions to labels
        results = []
        for i, pred in enumerate(predictions):
            results.append({
                "message": messages[i],
                "prediction": "Spam" if pred == 1 else "Not Spam"
            })

        return jsonify({"results": results})
    except Exception as e:
        print("❌ Batch prediction error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
