import { GameLoop } from "./gameloop.js";
import { WebGLContext } from "../graphics/webgl.js";
import { Renderer } from "../graphics/renderer.js";
import { Input } from "../input/input.js";
import { World } from "../world/world.js";
import { Player } from "../entity/player.js";
import { DebugPanel } from "../debug/fps.js";
import { SaveSystem } from "../save/save.js";
import { HUD } from "../ui/hud.js";
import { Menu } from "../ui/menu.js";
import { AudioSystem } from "../audio/audio.js";

export class Engine {
  constructor({ canvas, statusEl, menuEl, debugEl, playButton, config }) {
    this.canvas = canvas;
    this.statusEl = statusEl;
    this.menuEl = menuEl;
    this.debugEl = debugEl;
    this.playButton = playButton;
    this.config = config;
    this.started = false;
    this.debugVisible = !!config.debugDefault;
  }

  boot() {
    this.glContext = new WebGLContext(this.canvas, this.config);
    this.gl = this.glContext.gl;
    this.renderer = new Renderer(this.gl, this.config);
    this.input = new Input(this.canvas);
    this.world = new World(this.config);
    this.player = new Player(this.config, this.world, this.input);
    this.save = new SaveSystem(this.config);
    this.debug = new DebugPanel(this.debugEl, this.config);
    this.hud = new HUD(this.statusEl, this.config);
    this.menu = new Menu(this.menuEl, this.playButton);
    this.audio = new AudioSystem(this.config);

    this.loadSavedGame();
    this.bindEvents();

    this.loop = new GameLoop(
      (dt, time) => this.update(dt, time),
      (dt, time) => this.render(dt, time)
    );

    this.renderer.resize();
    this.hud.setMessage("Click Play, then enter the Frayed Reach.");
    this.debug.setVisible(this.debugVisible);
    this.updateDebug();

    window.addEventListener("resize", () => this.resize(), { passive: true });
    this.resize();
  }

  bindEvents() {
    this.playButton.addEventListener("click", () => this.startGame());
    this.canvas.addEventListener("click", () => {
      if (!this.started) this.startGame();
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "F3") {
        this.debugVisible = !this.debugVisible;
        this.debug.setVisible(this.debugVisible);
      }
    });
  }

  startGame() {
    if (this.started) return;
    this.started = true;
    this.menu.hide();
    this.input.lockPointer();
    this.audio.resume();
    this.loop.start();
    this.hud.setMessage("Explore the Frayed Reach. Find the first Anchor.");
  }

  loadSavedGame() {
    const save = this.save.load();
    if (save?.player) {
      this.player.setPosition(save.player.x, save.player.y, save.player.z);
      this.player.yaw = save.player.yaw ?? this.player.yaw;
      this.player.pitch = save.player.pitch ?? this.player.pitch;
    } else {
      const spawn = this.world.getSpawn();
      this.player.setPosition(spawn.x, spawn.y, spawn.z);
    }
  }

  resize() {
    this.glContext.resize();
    this.renderer.resize();
  }

  update(dt, time) {
    if (!this.started) return;
    this.input.update();
    this.player.update(dt);
    this.world.update(dt, time, this.player);
    this.audio.update(dt, time, this.player);
    this.debug.update(dt, time, this.player, this.world, this.renderer);
    this.updateDebug();
  }

  updateDebug() {
    this.debug.setText({
      "Loomfall": this.config.version,
      "Position": `${this.player.position.x.toFixed(1)}, ${this.player.position.y.toFixed(1)}, ${this.player.position.z.toFixed(1)}`,
      "Yaw/Pitch": `${this.player.yaw.toFixed(2)} / ${this.player.pitch.toFixed(2)}`,
      "Anchors": `${this.world.anchors.length}`,
      "Pointer": this.input.pointerLocked ? "Locked" : "Free",
      "FPS": this.debug.fps.toFixed(1),
      "Ground": this.player.onGround ? "Yes" : "No",
    });
  }

  render(dt, time) {
    if (!this.started) return;
    this.renderer.render({
      world: this.world,
      player: this.player,
      time,
    });
  }

  shutdown() {
    this.save.save(this.player, this.world);
  }
}
