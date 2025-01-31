# Real-time Face Recognition Web Application

This is a web-based application that performs real-time face recognition and movement detection using Face-API.js and Flask.

## Features
- Real-time face detection
- Facial landmark detection
- Expression recognition
- Live camera feed processing

## Setup Instructions

1. Install the required Python packages:
```bash
pip install -r requirements.txt
```

2. Download the Face-API.js models:
You'll need to download the following models from the face-api.js GitHub repository and place them in the `static/models` directory:
- tiny_face_detector_model
- face_landmark_68_model
- face_expression_model

3. Run the application:
```bash
python app.py
```

4. Open your web browser and navigate to `http://localhost:5000`

## Requirements
- Python 3.7+
- Webcam access
- Modern web browser (Chrome, Firefox, or Edge recommended)

## Note
Make sure to allow camera access when prompted by your browser.
