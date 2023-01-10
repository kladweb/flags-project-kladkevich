'use strict';

game.flags = {
  game: game,
  width: 500,
  height: 300,
  offsetX: 0,
  offsetY: 0,
  imagesFlags: null, //объект, содержащий все флаги, заполняется из отдельного js-файла
  unsolvedFlags: {}, //копия объекта imagesFlags, не содержащая уже раскрытые флаги.
  activeFlag: null, //рандомный флаг (рандомный ключ объекта imagesFlags)
  activeImageFlag: null, //img для отрисовки текущего флага
  getRandomFlag() {
    let numberActiveFlag = Math.floor(Math.random() * (Object.keys(this.imagesFlags).length));
    this.activeFlag = Object.keys(this.imagesFlags)[numberActiveFlag];
    this.game.answers.getRandomAnswers();
    // delete this.unsolvedFlags[this.activeFlag];
    // console.log(this.unsolvedFlags);
  },
  getUnsolvedFlags() {
    for (let key in this.imagesFlags) {
      this.unsolvedFlags[key] = this.imagesFlags[key];
    }
  },
  create() {
    const flagWidth = Math.min(this.game.width, this.width);
    this.offsetX = (this.game.width - flagWidth) / 2;
    this.offsetY = (this.game.height * 0.2);
    this.createFrame();
    this.preloadActiveFlag();
  },
  createFrame() {
    this.game.ctx.strokeStyle = '#eaeaea';
    this.game.ctx.lineWidth = 20;
    this.game.ctx.lineJoin = 'round';
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.offsetX, this.offsetY);
    this.game.ctx.lineTo(this.offsetX + this.width, this.offsetY);
    this.game.ctx.lineTo(this.offsetX + this.width, this.offsetY + this.height);
    this.game.ctx.lineTo(this.offsetX, this.offsetY + this.height);
    this.game.ctx.closePath();
  },
  preloadActiveFlag() {
    this.activeImageFlag = new Image();
    this.activeImageFlag.src = 'img/flags/' + this.activeFlag + '.png';
  },
  render() {
    this.activeImageFlag.addEventListener('load', () => {
      window.requestAnimationFrame(() => {
        this.game.ctx.stroke();
        this.game.ctx.drawImage(this.activeImageFlag, this.offsetX, this.offsetY, this.width, this.height);
      });
    });
  }
}