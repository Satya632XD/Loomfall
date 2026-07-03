export const vec2 = {
  create: () => [0, 0],
  set: (out, x, y) => ((out[0] = x), (out[1] = y), out),
};
