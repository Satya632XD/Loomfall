import { terrainHeight } from "./terrain.js";
import { Anchor } from "./anchor.js";
import { Mesh } from "../graphics/mesh.js";
import { mat4 } from "../math/mat4.js";

export class World {
  constructor(config) {
    this.config = config;
    this.size = config.terrainSize;
    this.segments = config.terrainSegments;
    this.halfSize = this.size / 2;
    this.terrainMesh = null;
    this.anchorMesh = null;
    this.anchors = [
      new Anchor(0, 0, 0, 1.3),
      new Anchor(18, 0, -12, 0.9),
      new Anchor(-22, 0, 14, 1.0),
    ];
    this.anchorModel = mat4.create();
    this.buildTerrain();
  }

  getSpawn() {
    const x = -6;
    const z = 10;
    return { x, y: this.getHeight(x, z) + 3, z };
  }

  getHeight(x, z) {
    const border = Math.max(Math.abs(x), Math.abs(z));
    const fade = Math.max(0, 1 - border / (this.halfSize * 1.12));
    return terrainHeight(x, z) * fade + 1.5;
  }

  buildTerrain() {
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    const seg = this.segments;
    const step = this.size / seg;

    const heights = [];
    for (let z = 0; z <= seg; z++) {
      heights[z] = [];
      for (let x = 0; x <= seg; x++) {
        const wx = -this.halfSize + x * step;
        const wz = -this.halfSize + z * step;
        heights[z][x] = this.getHeight(wx, wz);
      }
    }

    for (let z = 0; z <= seg; z++) {
      for (let x = 0; x <= seg; x++) {
        const wx = -this.halfSize + x * step;
        const wz = -this.halfSize + z * step;
        const y = heights[z][x];

        const hx = (heights[z][Math.min(seg, x + 1)] - heights[z][Math.max(0, x - 1)]) / (2 * step);
        const hz = (heights[Math.min(seg, z + 1)][x] - heights[Math.max(0, z - 1)][x]) / (2 * step);
        const nx = -hx;
        const ny = 1;
        const nz = -hz;
        const len = Math.hypot(nx, ny, nz) || 1;

        positions.push(wx, y, wz);
        normals.push(nx / len, ny / len, nz / len);

        const slope = Math.min(1, Math.abs(hx) + Math.abs(hz));
        const green = 0.4 + (1 - slope) * 0.22;
        const blue = 0.55 + y * 0.008;
        colors.push(0.25 + slope * 0.18, green, blue);
      }
    }

    for (let z = 0; z < seg; z++) {
      for (let x = 0; x < seg; x++) {
        const i = z * (seg + 1) + x;
        indices.push(i, i + 1, i + seg + 1);
        indices.push(i + 1, i + seg + 2, i + seg + 1);
      }
    }

    this.terrainMesh = {
      mesh: new Mesh(window.__loomfallGL, { positions, normals, colors, indices }),
      model: mat4.create(),
    };

    this.anchorMesh = Mesh.createCube(window.__loomfallGL, 1);
  }

  update(dt, time, player) {
    for (let i = 0; i < this.anchors.length; i++) {
      const a = this.anchors[i];
      const dist = Math.hypot(player.position.x - a.position.x, player.position.z - a.position.z);
      a.active = dist < 7.5;
    }
  }

  drawTerrain(program) {
    const gl = window.__loomfallGL;
    gl.uniformMatrix4fv(program.getUniform("uModel"), false, this.terrainMesh.model);
    this.terrainMesh.mesh.bindAttributes(program);
    gl.drawElements(gl.TRIANGLES, this.terrainMesh.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  drawAnchors(program, tempModel) {
    const gl = window.__loomfallGL;
    for (const anchor of this.anchors) {
      const h = this.getHeight(anchor.position.x, anchor.position.z);
      mat4.identity(tempModel);
      mat4.translate(tempModel, tempModel, [anchor.position.x, h + 2.0, anchor.position.z]);
      mat4.scale(tempModel, tempModel, [anchor.scale * 0.85, anchor.scale * 5.5, anchor.scale * 0.85]);
      if (anchor.active) {
        mat4.rotateY(tempModel, tempModel, performance.now() * 0.0006);
      }
      gl.uniformMatrix4fv(program.getUniform("uModel"), false, tempModel);
      this.anchorMesh.bindAttributes(program);
      gl.drawElements(gl.TRIANGLES, this.anchorMesh.indexCount, gl.UNSIGNED_SHORT, 0);
    }
  }
}
