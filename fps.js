export class DebugPanel {
  constructor(el) {
    this.el = el;
    this.visible = true;
    this.lines = {};
    this.fps = 0;
    this._acc = 0;
    this._frames = 0;
  }

  setVisible(visible) {
    this.visible = visible;
    if (this.el) this.el.classList.toggle("hidden", !visible);
  }

  setText(lines) {
    this.lines = lines;
    this.render();
  }

  update(dt) {
    this._acc += dt;
    this._frames += 1;
    if (this._acc >= 0.5) {
      this.fps = this._frames / this._acc;
      this._acc = 0;
      this._frames = 0;
    }
  }

  render() {
    if (!this.el || !this.visible) return;
    this.el.textContent = Object.entries(this.lines).map(([k, v]) => `${k}: ${v}`).join("\n");
  }
}
