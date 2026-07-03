export class HUD {
  constructor(statusEl) {
    this.statusEl = statusEl;
  }

  setMessage(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }
}
