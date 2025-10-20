# AI Spam Detection System

A machine learning-powered spam detection system built with Random Forest classifier and Flask. Features a modern web interface with single message and batch detection capabilities.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-orange)

## 🚀 Features

- **Single Message Detection**: Analyze individual messages in real-time
- **Batch Detection**: Upload CSV/TXT files to analyze multiple messages at once
- **Modern UI**: Beautiful gradient interface with smooth animations
- **High Accuracy**: 99.95% accuracy with Random Forest classifier
- **Export Results**: Download batch analysis results as CSV
- **Drag & Drop**: Easy file upload with drag and drop support

## 📊 Model Performance

- **Accuracy**: 99.95%
- **Precision**: 100%
- **Recall**: 99.90%
- **Algorithm**: Random Forest (500 trees)
- **Vectorization**: TF-IDF with n-grams

## 🛠️ Technologies

- **Backend**: Flask, Python
- **ML Libraries**: scikit-learn, pandas, joblib
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with Font Awesome icons

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/SemiAutomat1c/randomforrest_ml.git
cd randomforrest_ml
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Train the model (if not already trained):
```bash
python model.py
```

4. Run the application:
```bash
python app.py
```

5. Open your browser and visit: `http://127.0.0.1:5000`

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SemiAutomat1c/randomforrest_ml)

### Manual Deployment Steps:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

**Important Notes for Vercel:**
- Model files (`.pkl`) are large and may need to be hosted separately or compressed
- Consider using environment variables for configuration
- Vercel has file size limits for serverless functions

### Alternative: Deploy to Other Platforms

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Railway:**
- Connect your GitHub repository
- Railway will auto-detect Flask and deploy

**Render:**
- Connect repository
- Select Python environment
- Set build command: `pip install -r requirements.txt`
- Set start command: `gunicorn app:app`

## 📁 Project Structure

```
randomforrest_ml/
├── app.py                  # Flask application
├── model.py               # Model training script
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel configuration
├── spam_model.pkl        # Trained model (generated)
├── vectorizer.pkl        # TF-IDF vectorizer (generated)
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── index.css         # Styles
│   └── index.js          # JavaScript
├── sample_messages.csv   # 10 test messages
└── batch_test_100.csv    # 100 test messages
```

## 🎯 Usage

### Single Message Detection
1. Navigate to the "Single Detection" tab
2. Enter or paste your message
3. Click "Analyze Message"
4. View the result (Spam or Safe)

### Batch Detection
1. Navigate to the "Batch Detection" tab
2. Upload a CSV or TXT file (one message per line)
3. Click "Analyze Batch"
4. View results summary and detailed table
5. Export results if needed

### Sample CSV Format
```csv
message
"Your message here"
"Another message"
```

## 📈 Model Training

The model is trained on spam datasets with:
- Text cleaning and preprocessing
- TF-IDF vectorization (max 10,000 features, 1-2 n-grams)
- Class balancing through upsampling
- Stratified train-test split (80/20)
- Random Forest with 500 estimators

To retrain the model:
```bash
python model.py
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Forked from [kenerl77/randomforrest_ml](https://github.com/kenerl77/randomforrest_ml)
- Enhanced with modern UI and batch processing capabilities

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ using Flask and Machine Learning
