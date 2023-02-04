'use strict';
const game = {
  canvas: null,
  ctx: null,
  flags: null,
  width: 0,
  height: 0,
  score: 0,
  live: 5,
  dimensions: {
    max: {
      width: 1920,
      height: 1200
    },
    min: {
      width: 300,
      height: 300,
    }
  },
  colors: {
    logCabin: '#1e2418',
    shiraz: '#b1091d',
    gallery: '#eaeaea',
    osloGray: '#939999',
    osloGrayL: '#afb8b8',
    spicyMix: '#7a4d40',
    spicyMixL: '#905b4b',
    white: '#FFF',
    green: '#61ff10'
  },
  images: {
    background: null,
    logo: null,
    human: null
  },
  answers: null,
  start() {
    this.init();
    this.preload(() => {
      this.run();
    });
  },
  init() {
    this.canvas = document.getElementById('cva');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
    this.setTextFont();
    this.flags.getUnsolvedFlags(); //делаем копию объекта с флагами, из которого будем удалять элементы по мере игры
  },
  setTextFont() {
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = this.colors.gallery;
  },
  initDimensions() {
    const sizes = {
      maxWidth: this.dimensions.max.width,
      maxHeight: this.dimensions.max.height,
      minWidth: this.dimensions.min.width,
      minHeight: this.dimensions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight
    };
    if (sizes.realWidth / sizes.realHeight > sizes.maxWidth / sizes.maxHeight) {
      this.fitWidth(sizes);
    } else {
      this.fitHeight(sizes)
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  fitWidth(sizes) {
    this.height = Math.round(sizes.maxWidth * sizes.realHeight / sizes.realWidth);
    this.height = Math.min(this.height, sizes.maxHeight);
    this.height = Math.max(this.height, sizes.minHeight);
    this.width = Math.round(sizes.realWidth * this.height / sizes.realHeight);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  },
  fitHeight(sizes) {
    this.width = Math.round(sizes.realWidth * sizes.maxHeight / sizes.realHeight);
    this.width = Math.min(this.width, sizes.maxWidth);
    this.width = Math.max(this.width, sizes.minWidth);
    this.height = Math.round(this.width * sizes.realHeight / sizes.realWidth);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.images).length;
    required += Object.keys(this.flags.imagesFlags).length;
    const onAssetLoad = () => {
      ++loaded;
      // console.log(loaded);
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadImages(onAssetLoad);
  },
  preloadImages(onAssetLoadCallback) {
    for (let key in this.images) {
      this.images[key] = new Image();
      this.images[key].src = 'img/shared/' + key + '.png';
      this.images[key].addEventListener('load', onAssetLoadCallback);
    }
    for (let key in this.flags.imagesFlags) {
      this.flags.imagesFlagsLoaded[key] = new Image();
      this.flags.imagesFlagsLoaded[key].src = 'img/flags/' + key + '.png';
      this.flags.imagesFlagsLoaded[key].addEventListener('load', onAssetLoadCallback);
    }
  },
  run() {
    this.create();
    this.update();
    this.addListeners();
  },
  addListeners() {
    this.checkClickAnswerBind = this.answers.checkClickAnswer.bind(this.answers);
    this.checkMoveAnswerBind = this.answers.checkMoveAnswer.bind(this.answers);
    this.canvas.addEventListener('click', this.checkClickAnswerBind);
    this.canvas.addEventListener('mousemove', this.checkMoveAnswerBind);
  },
  // addListeners() {
  //   this.canvas.addEventListener('click', () => {
  //     this.answers.checkClickAnswer(event);
  //   });
  //   this.canvas.addEventListener('mousemove', this.answers.checkMoveAnswer);
  // },
  removeListeners() {
    this.canvas.removeEventListener('click', this.checkClickAnswerBind);
    this.canvas.removeEventListener('mousemove', this.checkMoveAnswerBind);
  },
  create() {
    this.flags.getRandomFlag();
    this.flags.create();
    this.answers.createAnswers();
  },
  update() {
    this.render();
  },
  render() {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.images.background, 0, 0);
      this.ctx.fillStyle = this.colors.spicyMix;
      this.ctx.globalAlpha = 0.75;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalAlpha = 1;
    });
    this.renderScore();
    this.renderLive();
    this.flags.render();
    this.answers.renderAnswers();
  },
  renderScore() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'left';
      const scoreSize = this.flags.width / 20;
      this.ctx.font = `${scoreSize}px Arial`;
      this.ctx.fillStyle = this.colors.gallery;
      let currentTextX = this.flags.offsetX;
      let currentTextY = this.flags.offsetY - this.flags.frameWidth / 2 - scoreSize;
      this.ctx.fillText(`SCORE: ${this.score}`, currentTextX, currentTextY);
    });
  },
  renderLive() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'left';
      const liveSize = this.flags.width / 20;
      this.ctx.font = `${liveSize}px Arial`;
      this.ctx.fillStyle = this.colors.gallery;
      let currentTextX = this.flags.offsetX + this.flags.width - liveSize * String(this.live).length / 2;
      let currentTextY = this.flags.offsetY - this.flags.frameWidth / 2 - liveSize;
      this.ctx.fillText(`${this.live}`, currentTextX, currentTextY);
      // console.log(this.images.human);
      currentTextX -= liveSize * (String(this.live).length + 1.5) / 2;
      currentTextY -= liveSize * 0.6;
      this.ctx.drawImage(this.images.human, currentTextX, currentTextY, liveSize, liveSize);
    });
  },
  continueGame() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'center';
      const infoSize = this.flags.width / 17;
      this.ctx.font = `${infoSize}px Arial`;
      this.ctx.fillStyle = this.colors.osloGray;
      let currentTextX = this.flags.offsetX + this.flags.width / 2;
      let currentTextY = this.answers.offsetY[this.answers.offsetY.length - 1] + this.answers.height + infoSize;
      this.ctx.fillText(`TAP or CLICK to CONTINUE...`, currentTextX, currentTextY);
    });
    this.startNextRoundBind = this.startNextRound.bind(this);
    this.canvas.addEventListener('click', this.startNextRoundBind);
  },
  startNextRound(e) {
    this.canvas.removeEventListener('click', this.startNextRoundBind);
    e.target.style.cursor = 'default';
    this.run();
  }
};

window.addEventListener('load', () => {
  game.start();
});