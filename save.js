import { migrateSave } from "./migration.js";

export class SaveSystem {
  constructor(config) {
    this.config = config;
  }

  load() {
    try {
      const raw = localStorage.getItem(this.config.saveKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return migrateSave(data);
    } catch {
      return null;
    }
  }

  save(player, world) {
    const data = {
      version: this.config.version,
      player: {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z,
        yaw: player.yaw,
        pitch: player.pitch,
      },
      world: {
        anchors: world.anchors.map((a) => ({ x: a.position.x, y: a.position.y, z: a.position.z, active: a.active })),
      },
    };
    localStorage.setItem(this.config.saveKey, JSON.stringify(data));
  }
}
