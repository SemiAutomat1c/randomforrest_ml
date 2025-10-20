from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(__name__)
try:
    model = joblib.load("spam_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
    print("✅ Model and vectorizer loaded successfully.")
except Exception as e:
    print("❌ Error loading model or vectorizer:", e)
    model, vectorizer = None, None


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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
