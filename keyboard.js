export class Keyboard {
  constructor() {
    this.down = new Set();
    this.pressed = new Set();
    this.released = new Set();

    window.addEventListener("keydown", (e) => {
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this.down.delete(e.code);
      this.released.add(e.code);
    });
  }

  isDown(code) {
    return this.down.has(code);
  }

  wasPressed(code) {
    return this.pressed.has(code);
  }

  wasReleased(code) {
    return this.released.has(code);
  }

  update() {
    this.pressed.clear();
    this.released.clear();
  }
}
