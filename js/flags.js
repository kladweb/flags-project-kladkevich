'use strict';

game.flags = {
  game: game,
  width: 500,  //ширина флага
  height: 300,  //высота флага
  frameWidth: 20,  //толщина белой рамки вокруг флага
  offsetX: 0,  //координаты верхнего левого угла флага
  offsetY: 0,
  imagesFlags: null, //объект, содержащий все флаги, находится в отдельном js-файле
  unsolvedFlags: {}, //копия объекта imagesFlags, не содержащая уже раскрытые флаги.
  imagesFlagsLoaded: {},  //загруженные флаги
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
    this.preloadActiveFlag();
    // let aspectRatioFlag = this.activeImageFlag.width / this.activeImageFlag.height;
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    console.log(this.activeImageFlag.width);
    console.log(this.activeImageFlag.height);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    console.log(aspectRatioWindow);
    console.log(this.game.width);
    console.log(this.game.height);

    if (aspectRatioWindow <= 1) {
      this.width = this.game.width * 0.8;
      this.height = this.width / 2;
    }
    if (aspectRatioWindow > 1) {
      this.height = this.game.height / 2.5;
      this.width = this.height * 2;
    }
    this.height = this.width / 2;

    const flagWidth = Math.min(this.game.width, this.width);
    this.offsetX = (this.game.width - flagWidth) / 2;
    this.offsetY = (this.game.height - (this.height + this.game.answers.height * 2 + this.game.answers.dist)) / 3;

  },
  preloadActiveFlag() {
    this.activeImageFlag = this.game.flags.imagesFlagsLoaded[this.activeFlag];
  },
  render() {
    window.requestAnimationFrame(() => {
      let aspectRatioFlag = this.activeImageFlag.width / this.activeImageFlag.height;
      let imageWidth = this.height * aspectRatioFlag;
      let imageX = this.offsetX + (this.width - imageWidth) / 2;
      this.game.ctx.globalAlpha = 0;
      this.game.ctx.strokeStyle = this.game.colors.gallery;
      this.game.ctx.lineWidth = this.frameWidth;
      this.game.ctx.lineJoin = 'round';
      this.game.ctx.strokeRect(this.offsetX, this.offsetY, this.width, this.height);
      this.game.ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height);
      this.game.ctx.globalAlpha = 1;
      this.game.ctx.drawImage(this.activeImageFlag, imageX, this.offsetY, imageWidth, this.height);
    });
  }
}