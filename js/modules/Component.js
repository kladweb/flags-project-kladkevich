export class Component {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.imageBackground = null;
    this.colors = {
      logCabin: '#1e2418',
      shiraz: '#b1091d',
      gallery: '#eaeaea',
      osloGray: '#939999',
      osloGrayL: '#afb8b8',
      spicyMix: '#7a4d40',
      spicyMixL: '#905b4b',
      white: '#FFF',
      green: '#61ff10'
    };
    this.dimensions = {
      max: {
        width: 1920,
        height: 1200
      },
      min: {
        width: 300,
        height: 300,
      }
    }
    // this.init();
    // this.renderStartBackground();
  }

  start() {
    this.init();
    this.renderStartBackground();
  }

  init() {
    this.canvas = document.getElementById('cva');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
  }

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
  }

  fitWidth(sizes) {
    this.height = Math.round(sizes.maxWidth * sizes.realHeight / sizes.realWidth);
    this.height = Math.min(this.height, sizes.maxHeight);
    this.height = Math.max(this.height, sizes.minHeight);
    this.width = Math.round(sizes.realWidth * this.height / sizes.realHeight);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  }

  fitHeight(sizes) {
    this.width = Math.round(sizes.realWidth * sizes.maxHeight / sizes.realHeight);
    this.width = Math.min(this.width, sizes.maxWidth);
    this.width = Math.max(this.width, sizes.minWidth);
    this.height = Math.round(this.width * sizes.realHeight / sizes.realWidth);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  }

  renderStartBackground() {
    this.preloadStartData(() => {
      this.run();
    });
  }

  run() {
    this.renderBackground();
    this.setCursor();
  }

  setCursor() {
    this.canvas.style.cursor = 'url(../img/cursors/earth-cursor.png), default';
  }

  preloadStartData(callback) {
    this.imageBackground = new Image();
    this.imageBackground.src = `img/shared/background.png`;
    this.imageBackground.addEventListener('load', callback);
  }

  renderBackground() {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.imageBackground, 0, 0);
      this.ctx.fillStyle = this.colors.spicyMix;
      this.ctx.globalAlpha = 0.75;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalAlpha = 1;
    });
  }

  renderLoader() {
    const loadSize = this.width / 25;
    const offsetXLoader = this.width / 2;
    const offsetYLoader = this.height / 2;
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${loadSize}px Arial`;
      this.ctx.fillStyle = this.colors.osloGray;
      this.ctx.fillText(`LOAD GAME...`, offsetXLoader, offsetYLoader);
    })
  }

  // preloadData(callback) {
  //   let loaded = 0;
  //   let required = Object.keys(this.images).length;
  //   // required += Object.keys(this.flags.imagesFlags).length;
  //   const onAssetLoad = () => {
  //     ++loaded;
  //     // console.log(loaded);
  //     if (loaded >= required) {
  //       callback();
  //     }
  //   };
  //   this.preloadImages(onAssetLoad);
  // }
  //
  // preloadImages(onAssetLoadCallback) {
  //   for (let key in this.images) {
  //     this.images[key] = new Image();
  //     this.images[key].src = 'img/shared/' + key + '.png';
  //     this.images[key].addEventListener('load', onAssetLoadCallback);
  //   }
  // }
}