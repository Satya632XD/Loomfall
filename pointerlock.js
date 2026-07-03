export class PointerLock {
  constructor(target) {
    this.target = target;
    this.pointerLocked = false;

    document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.target;
    });
  }

  request() {
    if (this.target.requestPointerLock) this.target.requestPointerLock();
  }

  exit() {
    if (document.exitPointerLock) document.exitPointerLock();
  }
}
