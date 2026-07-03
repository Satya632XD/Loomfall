export const vec3 = {
  create: () => [0, 0, 0],
  set: (out, x, y, z) => ((out[0] = x), (out[1] = y), (out[2] = z), out),
  add: (out, a, b) => ((out[0] = a[0] + b[0]), (out[1] = a[1] + b[1]), (out[2] = a[2] + b[2]), out),
  subtract: (out, a, b) => ((out[0] = a[0] - b[0]), (out[1] = a[1] - b[1]), (out[2] = a[2] - b[2]), out),
  scale: (out, a, s) => ((out[0] = a[0] * s), (out[1] = a[1] * s), (out[2] = a[2] * s), out),
  length: (a) => Math.hypot(a[0], a[1], a[2]),
  normalize: (out, a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    out[0] = a[0] / l; out[1] = a[1] / l; out[2] = a[2] / l;
    return out;
  },
};
