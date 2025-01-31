const video = document.getElementById('video');
const status = document.getElementById('status');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const expressionElement = document.getElementById('expression');
const headPositionElement = document.getElementById('headPosition');

let isRunning = false;
let detectInterval;

// Load required face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/')
]).then(startVideo);

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            status.textContent = 'Models loaded! Click Start Detection to begin.';
            startButton.disabled = false;
        })
        .catch(err => {
            status.textContent = 'Error accessing camera: ' + err.message;
        });
}

function stopDetection() {
    if (detectInterval) {
        clearInterval(detectInterval);
    }
    isRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    status.textContent = 'Detection stopped';
}

function startDetection() {
    if (!video.srcObject) {
        status.textContent = 'Please allow camera access first';
        return;
    }

    isRunning = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    status.textContent = 'Detection running...';

    // Create canvas if it doesn't exist
    if (!document.querySelector('canvas')) {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.querySelector('.video-container').append(canvas);
        faceapi.matchDimensions(canvas, { width: video.width, height: video.height });
    }

    detectInterval = setInterval(async () => {
        if (!isRunning) return;

        const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

        const canvas = document.querySelector('canvas');
        const displaySize = { width: video.width, height: video.height };
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw detections
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Update metrics
        if (detections.length > 0) {
            const detection = detections[0];
            
            // Get dominant expression
            const expressions = detection.expressions;
            const dominantExpression = Object.keys(expressions).reduce((a, b) => 
                expressions[a] > expressions[b] ? a : b
            );
            expressionElement.textContent = dominantExpression;

            // Calculate head position based on landmarks
            const landmarks = detection.landmarks;
            const nose = landmarks.getNose()[0];
            const leftEye = landmarks.getLeftEye()[0];
            const rightEye = landmarks.getRightEye()[0];
            
            const eyeDistance = Math.abs(leftEye.x - rightEye.x);
            const noseOffset = (nose.x - (leftEye.x + rightEye.x) / 2) / eyeDistance;
            
            let position = 'center';
            if (noseOffset > 0.2) position = 'right';
            else if (noseOffset < -0.2) position = 'left';
            
            headPositionElement.textContent = position;
        } else {
            expressionElement.textContent = '-';
            headPositionElement.textContent = '-';
        }
    }, 100);
}

startButton.addEventListener('click', startDetection);
stopButton.addEventListener('click', stopDetection);
