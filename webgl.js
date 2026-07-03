export class WebGLContext {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });

    if (!this.gl) {
      throw new Error("WebGL is not supported in this browser.");
    }

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.clearColor(...config.clearColor, 1);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(this.canvas.clientWidth * dpr);
    const height = Math.floor(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = Math.max(width, 1);
      this.canvas.height = Math.max(height, 1);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
