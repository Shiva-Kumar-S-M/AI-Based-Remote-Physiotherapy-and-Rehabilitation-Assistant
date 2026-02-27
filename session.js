class SessionLogger {
  constructor() {
    this.history = [];
  }

  log(rep, score) {
    this.history.push({ rep, score, time: new Date() });
  }
}