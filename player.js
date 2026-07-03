import { Camera } from "../graphics/camera.js";
import { clamp } from "../utils/helpers.js";

export class Player {
  constructor(config, world, input) {
    this.config = config;
    this.world = world;
    this.input = input;
    this.position = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.yaw = 0;
    this.pitch = -0.1;
    this.onGround = false;
    this.cameraPosition = { x: 0, y: 0, z: 0 };
    this._jumpLatch = false;
  }

  setPosition(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  update(dt) {
    const kb = this.input.keyboard;
    const mouse = this.input.mouse;

    this.yaw -= mouse.dx * this.config.mouseSensitivity;
    this.pitch -= mouse.dy * this.config.mouseSensitivity;
    this.pitch = clamp(this.pitch, -1.35, 1.35);

    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    const forwardX = sin;
    const forwardZ = cos;
    const rightX = cos;
    const rightZ = -sin;

    let moveX = 0;
    let moveZ = 0;

    if (kb.isDown("KeyW")) { moveX += forwardX; moveZ += forwardZ; }
    if (kb.isDown("KeyS")) { moveX -= forwardX; moveZ -= forwardZ; }
    if (kb.isDown("KeyD")) { moveX += rightX; moveZ += rightZ; }
    if (kb.isDown("KeyA")) { moveX -= rightX; moveZ -= rightZ; }

    const len = Math.hypot(moveX, moveZ) || 1;
    moveX /= len;
    moveZ /= len;

    const sprint = kb.isDown("ShiftLeft") || kb.isDown("ShiftRight");
    const speed = this.config.moveSpeed * (sprint ? this.config.sprintMultiplier : 1);

    this.position.x += moveX * speed * dt;
    this.position.z += moveZ * speed * dt;

    this.velocity.y -= this.config.gravity * dt;
    if (this.onGround) this.velocity.y = Math.max(this.velocity.y, -2);

    const jumped = kb.isDown("Space");
    if (jumped && !this._jumpLatch && this.onGround) {
      this.velocity.y = this.config.jumpVelocity;
      this.onGround = false;
    }
    this._jumpLatch = jumped;

    this.position.y += this.velocity.y * dt;

    const ground = this.world.getHeight(this.position.x, this.position.z) + this.config.playerHeight;
    if (this.position.y <= ground) {
      this.position.y = ground;
      this.velocity.y = 0;
      this.onGround = true;
    }

    this.cameraPosition.x = this.position.x;
    this.cameraPosition.y = this.position.y;
    this.cameraPosition.z = this.position.z;
  }
}
