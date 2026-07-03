export class Mesh {
  constructor(gl, { positions, normals, colors, indices }) {
    this.gl = gl;
    this.indexCount = indices.length;
    this.vao = null;
    this.buffers = {};

    this._createBuffer("position", positions, 3);
    this._createBuffer("normal", normals, 3);
    this._createBuffer("color", colors, 3);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  _createBuffer(name, data, size) {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.buffers[name] = { buffer, size };
  }

  bindAttributes(program) {
    const gl = this.gl;
    for (const [name, { buffer, size }] of Object.entries(this.buffers)) {
      const loc = program.getAttribute(`a${name[0].toUpperCase()}${name.slice(1)}`);
      if (loc < 0) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  }

  static createCube(gl, size = 1) {
    const s = size / 2;
    const positions = [
      -s,-s,-s,  s,-s,-s,  s, s,-s, -s, s,-s,
      -s,-s, s,  s,-s, s,  s, s, s, -s, s, s,
    ];
    const normals = [
      0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
      0,0,1, 0,0,1, 0,0,1, 0,0,1,
    ];
    const colors = [
      0.8,0.9,1.0, 0.8,0.9,1.0, 0.8,0.9,1.0, 0.8,0.9,1.0,
      0.7,0.8,1.0, 0.7,0.8,1.0, 0.7,0.8,1.0, 0.7,0.8,1.0,
    ];
    const indices = [
      0,1,2, 0,2,3,
      4,5,6, 4,6,7,
      0,4,7, 0,7,3,
      1,5,6, 1,6,2,
      3,2,6, 3,6,7,
      0,1,5, 0,5,4,
    ];
    return new Mesh(gl, { positions, normals, colors, indices });
  }
}
