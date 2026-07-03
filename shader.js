export class ShaderProgram {
  constructor(gl, vertexSource, fragmentSource) {
    this.gl = gl;
    const vs = this._compile(gl.VERTEX_SHADER, vertexSource);
    const fs = this._compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      throw new Error(`Shader link failed: ${info}`);
    }
    this.program = program;
    this.uniforms = new Map();
    this.attributes = new Map();
  }

  _compile(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile failed: ${info}\n${source}`);
    }
    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  getUniform(name) {
    if (!this.uniforms.has(name)) {
      this.uniforms.set(name, this.gl.getUniformLocation(this.program, name));
    }
    return this.uniforms.get(name);
  }

  getAttribute(name) {
    if (!this.attributes.has(name)) {
      this.attributes.set(name, this.gl.getAttribLocation(this.program, name));
    }
    return this.attributes.get(name);
  }
}
