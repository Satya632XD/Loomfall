export class Menu {
  constructor(menuEl, playButton) {
    this.menuEl = menuEl;
    this.playButton = playButton;
  }

  hide() {
    if (this.menuEl) this.menuEl.style.display = "none";
  }
}
