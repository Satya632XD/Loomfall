export function getLighting(config) {
  return {
    ambient: config.ambientStrength,
    directional: config.directionalStrength,
    direction: config.directionalLightDir,
  };
}
