export class Material {
  constructor(shader, uniforms = {}) {
    this.shader = shader;
    this.uniforms = uniforms;
  }
}
