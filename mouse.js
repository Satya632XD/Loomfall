export class Mouse {
  constructor() {
    this.dx = 0;
    this.dy = 0;
    this.buttons = new Set();

    window.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement) {
        this.dx += e.movementX || 0;
        this.dy += e.movementY || 0;
      }
    });

    window.addEventListener("mousedown", (e) => this.buttons.add(e.button));
    window.addEventListener("mouseup", (e) => this.buttons.delete(e.button));
  }

  update() {
    this.dx = 0;
    this.dy = 0;
  }
}
