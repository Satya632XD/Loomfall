import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";
import { PointerLock } from "./pointerlock.js";

export class Input {
  constructor(canvas) {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.pointerLock = new PointerLock(canvas);
  }

  get pointerLocked() {
    return this.pointerLock.pointerLocked;
  }

  lockPointer() {
    this.pointerLock.request();
  }

  update() {
    this.keyboard.update();
    this.mouse.update();
  }
}
