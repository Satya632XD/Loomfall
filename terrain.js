import { fbm } from "../utils/random.js";

export function terrainHeight(x, z) {
  const base = fbm(x, z, 9087);
  const ridges = Math.abs(fbm(x + 1000, z - 1000, 2244) - 0.5) * 2;
  const plateau = fbm(x * 0.35, z * 0.35, 9021);
  return (
    Math.sin(x * 0.035) * 1.1 +
    Math.cos(z * 0.03) * 1.0 +
    base * 7.5 +
    ridges * 4.2 +
    plateau * 5.8
  );
}
