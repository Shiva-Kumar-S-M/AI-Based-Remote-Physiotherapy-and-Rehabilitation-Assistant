class ExerciseEngine {
  constructor(exercise) {
    this.exercise = exercise;
    this.stage = "up";
    this.reps = 0;
    this.score = 0;
  }

  process(landmarks) {
    let angle;

    if (this.exercise.hip) {
      const hip = landmarks[this.exercise.hip];
      const knee = landmarks[this.exercise.knee];
      const ankle = landmarks[this.exercise.ankle];
      angle = calculateAngle(hip, knee, ankle);
    } else {
      const shoulder = landmarks[this.exercise.shoulder];
      const elbow = landmarks[this.exercise.elbow];
      const wrist = landmarks[this.exercise.wrist];
      angle = calculateAngle(shoulder, elbow, wrist);
    }

    this.update(angle);
    return angle;
  }

  update(angle) {
    if (angle > this.exercise.upAngle) {
      this.stage = "up";
    }

    if (angle < this.exercise.downAngle && this.stage === "up") {
      this.stage = "down";
      this.reps++;
      this.calculateScore(angle);
    }
  }

  calculateScore(angle) {
    if (
      angle >= this.exercise.idealMin &&
      angle <= this.exercise.idealMax
    ) {
      this.score += 10;
    } else {
      this.score += 5;
    }
  }
}