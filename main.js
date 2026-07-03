import { CONFIG } from "./config.js";
import { Engine } from "./core/engine.js";

const canvas = document.getElementById("gameCanvas");
const playButton = document.getElementById("playButton");
const menu = document.getElementById("menu");
const status = document.getElementById("status");
const debugPanel = document.getElementById("debugPanel");

const engine = new Engine({
  canvas,
  statusEl: status,
  menuEl: menu,
  debugEl: debugPanel,
  playButton,
  config: CONFIG,
});

engine.boot();

window.addEventListener("beforeunload", () => {
  engine.shutdown();
});
