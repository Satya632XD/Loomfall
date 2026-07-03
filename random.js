export class RNG {
  constructor(seed = 123456789) {
    this.seed = seed >>> 0;
  }

  next() {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  range(min, max) {
    return min + (max - min) * this.next();
  }

  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
}

export function hash2(x, z, seed = 1337) {
  let n = x * 374761393 + z * 668265263 + seed * 1442695041;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

export function smoothNoise(x, z, seed = 1337) {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const tx = x - x0;
  const tz = z - z0;
  const a = hash2(x0, z0, seed);
  const b = hash2(x0 + 1, z0, seed);
  const c = hash2(x0, z0 + 1, seed);
  const d = hash2(x0 + 1, z0 + 1, seed);
  const u = tx * tx * (3 - 2 * tx);
  const v = tz * tz * (3 - 2 * tz);
  const ab = a * (1 - u) + b * u;
  const cd = c * (1 - u) + d * u;
  return ab * (1 - v) + cd * v;
}

export function fbm(x, z, seed = 1337) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 0.02;
  for (let i = 0; i < 5; i++) {
    value += smoothNoise(x * frequency, z * frequency, seed + i * 17) * amplitude;
    frequency *= 2;
    amplitude *= 0.5;
  }
  return value;
}
