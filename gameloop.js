import { Timer } from "./timer.js";

export class GameLoop {
  constructor(update, render) {
    this.timer = new Timer();
    this.update = update;
    this.render = render;
    this.running = false;
    this.boundFrame = this.frame.bind(this);
  }

  start() {
    this.running = true;
    this.timer.last = performance.now();
    requestAnimationFrame(this.boundFrame);
  }

  stop() {
    this.running = false;
  }

  frame() {
    if (!this.running) return;
    const dt = this.timer.tick();
    this.update(dt, this.timer.elapsed);
    this.render(dt, this.timer.elapsed);
    requestAnimationFrame(this.boundFrame);
  }
}
