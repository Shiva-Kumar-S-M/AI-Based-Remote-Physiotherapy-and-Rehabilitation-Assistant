const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const exerciseSelect = document.getElementById("exerciseSelect");

let engine;
let session = new SessionLogger();

function initExercises() {
  for (let key in EXERCISES) {
    let option = document.createElement("option");
    option.value = key;
    option.text = EXERCISES[key].name;
    exerciseSelect.appendChild(option);
  }

  engine = new ExerciseEngine(EXERCISES[exerciseSelect.value]);
}

exerciseSelect.addEventListener("change", () => {
  engine = new ExerciseEngine(EXERCISES[exerciseSelect.value]);
});

initExercises();

const pose = new Pose({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: CONFIG.detectionConfidence,
  minTrackingConfidence: CONFIG.trackingConfidence
});

pose.onResults(results => {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, 640, 480);

  if (results.poseLandmarks) {
    const angle = engine.process(results.poseLandmarks);

    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
      { color: '#00FF00', lineWidth: 4 });

    drawLandmarks(canvasCtx, results.poseLandmarks,
      { color: '#FF0000', lineWidth: 2 });

    document.getElementById("repCount").innerText =
      "Reps: " + engine.reps;

    document.getElementById("formScore").innerText =
      "Score: " + engine.score;

    document.getElementById("status").innerText =
      "Angle: " + Math.round(angle);
  }
});

// create camera helper and start it; browsers require a secure context (https or localhost)
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

// start the camera stream; visible console error if unable to access device
camera.start().catch(err => {
  console.error("Camera start failed:", err);
  document.getElementById("status").innerText = "Status: camera error";
});

