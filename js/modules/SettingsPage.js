import {Component} from './Component.js';

export class SettingsPage extends Component {
  constructor(spa) {
    super();
    this.spa = spa;
    this.checkedImg = [];  //массив с двумя png чередующимися картинками (с галочкой и без галочки);
    this.imgSet = {
      checked: null,
      unchecked: null
    };
    this.settings = [1, 1];
    // this.settings[0] = 1; //музыка включена
    // this.settings[1] = 1; //звуки включены
  }

  initPageSet() {
    this.spa.playMelody();
    this.start();
    this.setCursor();
    this.preloadSetPageData(() => {
      this.loadSet();
    })
  }

  preloadSetPageData(callback) {
    this.imageBackground = new Image();
    this.imageBackground.src = `img/shared/background.png`;
    this.imageBackground.addEventListener('load', callback);
  }

  loadSet() {
    this.renderBackground();
    // this.renderSetPage();
    this.loadCheckedImg();
    this.addListeners();
    console.log(' НУЖНЫЦ СЛУШАТЕЛЬ !!! ЕСТЬ');
  }

  loadCheckedImg() {
    this.preloadImgFiles(() => {
      this.runSetPage();
    });
  }

  preloadImgFiles(callback) {
    let loaded = 0;
    let required = Object.keys(this.imgSet).length;
    const onAssetLoad = () => {
      ++loaded;
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadImages(onAssetLoad);
  }

  preloadImages(onAssetLoadCallback) {
    for (let key in this.imgSet) {
      this.imgSet[key] = new Image();
      this.imgSet[key].src = 'img/shared/' + key + '.png';
      this.imgSet[key].addEventListener('load', onAssetLoadCallback);
    }
  }

  runSetPage() {
    this.checkedImg[0] = this.imgSet.unchecked;
    this.checkedImg[1] = this.imgSet.checked;
    this.renderSetPage();
  }

  addListeners() {
    console.log('нузный ЗИС', this);
    this.checkClickCheckThis = this.checkClickCheck.bind(this);
    this.canvas.addEventListener('click', this.checkClickCheckThis);
  }

  removeListeners() {
    this.canvas.removeEventListener('click', this.checkClickCheckThis);
  }

  checkClickCheck(e) {
    console.log('НУЖНЫЙ КЛИК', e);
    let zoom = this.calcZoom();
    for (let j = 0; j <= 1; j++) {
      if (this.checkBorders(e, zoom, j)) {
        // console.log('Variant', j, 'click');
        this.showResult(j);
      }
    }
  }

  checkBorders(e, k, number) {
    let borderLeft = e.pageX * k > this.X2;
    let borderRight = e.pageX * k < this.X2 + this.checkSize;
    let borderTop = e.pageY * k > this.Y[number];
    let borderBottom = e.pageY * k < this.Y[number] + this.checkSize;
    return borderLeft && borderRight && borderTop && borderBottom;
  }

  calcZoom() {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = this.canvas.getBoundingClientRect();
    return oldCanvas.width / currentSizes.width;
  }

  showResult(num) {
    // if (num === 0) {
    //   this.spa.playMelody();
    // }
    this.settings[num] = (this.settings[num] === 1) ? 0 : 1;
    if (this.settings[1] === 1) {
      this.spa.playClick();
    }
    this.spa.saveSettings();
    // console.log(this.settings[num]);
    this.renderBackground();
    this.renderSetPage();
  }

  renderSetPage() {
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    // console.log(aspectRatioWindow);
    if (aspectRatioWindow <= 0.5) {
      this.textSetSize = this.width / 25;
      this.X1 = this.width / 4.5;
      this.Y1 = this.textSetSize * 5;
    }
    if (aspectRatioWindow > 0.5 && aspectRatioWindow <= 1) {
      this.textSetSize = this.width / 30;
      this.X1 = this.width / 4;
      this.Y1 = this.textSetSize * 4.5;
    }
    if (aspectRatioWindow > 1 && aspectRatioWindow <= 1.5) {
      this.textSetSize = this.width / 35;
      this.X1 = this.width / 3.5;
      this.Y1 = this.textSetSize * 3;
    }
    if (aspectRatioWindow > 1.5) {
      this.textSetSize = this.height / 30;
      this.X1 = this.width / 3;
      this.Y1 = this.textSetSize * 3;
    }
    this.X2 = this.width - this.X1 - this.textSetSize * 1.5;
    this.checkSize = this.textSetSize * 2;
    this.ctx.font = `${this.textSetSize * 1.5}px Arial`;
    let currentX = this.width / 2;
    let currentY = this.Y1;
    let Al = 'center';
    let text0 = 'GAME SETTINGS';
    this.renderSetText(text0, currentX, currentY, this.textSetSize * 2, this.colors.green, Al);
    let text1 = 'MUSIC';
    this.Y = [];
    this.Y[0] = this.Y1 + this.textSetSize * 5 - this.checkSize / 1.5;
    Al = 'left';
    let currYText = this.Y[0] + this.checkSize / 1.5;
    this.renderSetText(text1, this.X1, currYText, this.textSetSize * 1.5, this.colors.osloGrayL, Al);
    this.renderChecked(this.checkedImg[this.settings[0]], this.X2, this.Y[0]);
    this.Y[1] = this.Y[0] + this.textSetSize * 5;
    let text2 = 'SOUNDS';
    currYText = this.Y[1] + this.checkSize / 1.5;
    this.renderSetText(text2, this.X1, currYText, this.textSetSize * 1.5, this.colors.osloGrayL, Al);
    this.renderChecked(this.checkedImg[this.settings[1]], this.X2, this.Y[1]);
  }

  renderSetText(text, currentX, currentY, textSize, color, Align) {
    window.requestAnimationFrame(() => {
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = Align;
      this.ctx.font = `${textSize}px Arial`;
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = 1;
      this.ctx.fillText(text, currentX, currentY);
    });
  }

  renderChecked(img, X, Y) {
    window.requestAnimationFrame(() => {
      this.ctx.drawImage(img, X, Y, this.checkSize, this.checkSize);
    });
  }
}