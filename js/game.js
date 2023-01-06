'use strict';
const game = {
  canvas: null,
  ctx: null,
  flags: null,
  width: 0,
  height: 0,
  score: 0,
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
  images: {
    background: null,
    logo: null
  },
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
  },
  setTextFont() {
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#ff000e';
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
    this.canvas.style.height = '100%';
  },
  fitHeight(sizes) {
    this.width = Math.round(sizes.realWidth * sizes.maxHeight / sizes.realHeight);
    this.width = Math.min(this.width, sizes.maxWidth);
    this.width = Math.max(this.width, sizes.minWidth);
    this.height = Math.round(this.width * sizes.realHeight / sizes.realWidth);
    this.canvas.style.height = '100%';
  },
  preload(callback) {
    let loaded = 0;
    const required = Object.keys(this.images).length;
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
  },
  run() {
    this.create();
    this.update();
  },
  create() {
    this.flags.getRandomFlag();
  },
  update() {
    this.render();
  },
  render() {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.images.background, 0, 0);
      this.ctx.fillStyle = '#996F3D';
      this.ctx.globalAlpha = 0.75;
      this.ctx.fillRect(0, 0, this.width, this.height);
    })
  },

};

window.addEventListener('load', () => {
  game.start();
})