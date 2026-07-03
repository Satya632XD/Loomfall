export class Timer {
  constructor() {
    this.last = performance.now();
    this.delta = 0;
    this.elapsed = 0;
  }

  tick() {
    const now = performance.now();
    this.delta = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.elapsed += this.delta;
    return this.delta;
  }
}
