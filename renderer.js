import { ShaderProgram } from "./shader.js";
import { Camera } from "./camera.js";
import { Sky } from "./sky.js";
import { getLighting } from "./lighting.js";
import { mat4 } from "../math/mat4.js";
import { Mesh } from "./mesh.js";

const VERTEX_SOURCE = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform vec3 uLightDirection;
uniform float uAmbient;
uniform float uDirectional;
uniform vec3 uFogColor;
uniform float uFogDensity;

varying vec3 vColor;
varying float vLighting;
varying float vFog;

void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vec3 normal = normalize(mat3(uModel) * aNormal);
  float light = max(dot(normal, normalize(-uLightDirection)), 0.0);
  vColor = aColor;
  vLighting = uAmbient + light * uDirectional;
  vec4 viewPos = uView * worldPos;
  float depth = abs(viewPos.z);
  vFog = clamp(1.0 - exp(-depth * uFogDensity), 0.0, 1.0);
  gl_Position = uProjection * viewPos;
}
`;

const FRAGMENT_SOURCE = `
precision mediump float;

varying vec3 vColor;
varying float vLighting;
varying float vFog;

uniform vec3 uFogColor;

void main() {
  vec3 lit = vColor * vLighting;
  vec3 finalColor = mix(lit, uFogColor, vFog);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export class Renderer {
  constructor(gl, config) {
    this.gl = gl;
    this.config = config;
    this.program = new ShaderProgram(gl, VERTEX_SOURCE, FRAGMENT_SOURCE);
    this.camera = new Camera(config);
    this.sky = new Sky(config);
    this.light = getLighting(config);
    this.cubeMesh = Mesh.createCube(gl, 1);
    this.tempModel = mat4.create();
  }

  resize() {
    this.camera.setAspect(this.gl.canvas.width / this.gl.canvas.height);
  }

  render({ world, player, time }) {
    const gl = this.gl;
    this.sky.clear(gl);

    this.camera.position.x = player.cameraPosition.x;
    this.camera.position.y = player.cameraPosition.y;
    this.camera.position.z = player.cameraPosition.z;
    this.camera.yaw = player.yaw;
    this.camera.pitch = player.pitch;
    this.camera.update();

    this.program.use();
    gl.uniformMatrix4fv(this.program.getUniform("uProjection"), false, this.camera.projection);
    gl.uniformMatrix4fv(this.program.getUniform("uView"), false, this.camera.view);
    gl.uniform3f(this.program.getUniform("uFogColor"), ...this.config.fogColor);
    gl.uniform1f(this.program.getUniform("uFogDensity"), 0.016);
    gl.uniform3f(this.program.getUniform("uLightDirection"), ...this.light.direction);
    gl.uniform1f(this.program.getUniform("uAmbient"), this.light.ambient);
    gl.uniform1f(this.program.getUniform("uDirectional"), this.light.directional);

    world.drawTerrain(this.program);
    world.drawAnchors(this.program, this.tempModel);
    this.drawSkyMonolith(time);
  }

  drawSkyMonolith(time) {
    const gl = this.gl;
    const t = time * 0.5;
    mat4.identity(this.tempModel);
    mat4.translate(this.tempModel, this.tempModel, [0, 28 + Math.sin(t) * 0.8, -42]);
    mat4.rotateY(this.tempModel, this.tempModel, t * 0.12);
    mat4.scale(this.tempModel, this.tempModel, [3.5, 12, 3.5]);
    gl.uniformMatrix4fv(this.program.getUniform("uModel"), false, this.tempModel);
    this.cubeMesh.bindAttributes(this.program);
    gl.drawElements(gl.TRIANGLES, this.cubeMesh.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
