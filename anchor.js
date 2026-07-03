export class Anchor {
  constructor(x, y, z, scale = 1) {
    this.position = { x, y, z };
    this.scale = scale;
    this.active = false;
  }
}
