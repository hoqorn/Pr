import requests
import os

def download_file(url, filename):
    if not os.path.exists('static/models'):
        os.makedirs('static/models')
    
    filepath = os.path.join('static/models', filename)
    if not os.path.exists(filepath):
        print("Downloading {}...".format(filename))
        response = requests.get(url)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print("Downloaded {}".format(filename))
    else:
        print("{} already exists".format(filename))

# Base URL for the models
base_url = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# List of models to download
models = [
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
]

# Download each model
for model in models:
    download_file("{}/{}".format(base_url, model), model)
