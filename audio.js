export class AudioSystem {
  constructor(config) {
    this.config = config;
    this.context = null;
    this.master = null;
  }

  resume() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.context = new AC();
      this.master = this.context.createGain();
      this.master.gain.value = 0.035;
      this.master.connect(this.context.destination);
      this._startDrone();
    }
    if (this.context.state === "suspended") this.context.resume();
  }

  _startDrone() {
    if (!this.context) return;
    const osc = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    osc.type = "sine";
    osc.frequency.value = 55;
    filter.type = "lowpass";
    filter.frequency.value = 220;
    osc.connect(filter);
    filter.connect(this.master);
    osc.start();

    const osc2 = this.context.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 110;
    const g = this.context.createGain();
    g.gain.value = 0.018;
    osc2.connect(g);
    g.connect(this.master);
    osc2.start();

    this._osc = osc;
    this._osc2 = osc2;
  }

  update(dt, time, player) {}
}
