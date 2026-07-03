import { mat4 } from "../math/mat4.js";

export class Camera {
  constructor(config) {
    this.position = { x: 0, y: 0, z: 0 };
    this.yaw = 0;
    this.pitch = 0;
    this.aspect = 1;
    this.fov = config.fov;
    this.near = config.near;
    this.far = config.far;
    this.projection = mat4.create();
    this.view = mat4.create();
  }

  setAspect(aspect) {
    this.aspect = aspect;
    mat4.perspective(this.projection, this.fov, aspect, this.near, this.far);
  }

  update() {
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);

    const forward = {
      x: sy * cp,
      y: sp,
      z: cy * cp,
    };

    const target = {
      x: this.position.x + forward.x,
      y: this.position.y + forward.y,
      z: this.position.z + forward.z,
    };

    mat4.lookAt(
      this.view,
      [this.position.x, this.position.y, this.position.z],
      [target.x, target.y, target.z],
      [0, 1, 0]
    );
  }
}
