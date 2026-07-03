export class Sky {
  constructor(config) {
    this.config = config;
  }

  clear(gl) {
    gl.clearColor(...this.config.clearColor, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
