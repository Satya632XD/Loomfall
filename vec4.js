export const vec4 = {
  create: () => [0, 0, 0, 0],
  set: (out, x, y, z, w) => ((out[0]=x),(out[1]=y),(out[2]=z),(out[3]=w),out),
};
