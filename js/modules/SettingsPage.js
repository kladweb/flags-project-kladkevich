import {Component} from './Component.js';

export class SettingsPage extends Component {
  constructor(spa) {
    super();
    this.spa = spa;
    this.isMobile = null;  //является ли устройство мобильным (для включения возможностей вибро);
    this.checkedImg = [];  //массив с двумя 'png' чередующимися картинками (с галочкой и без галочки);
    this.imgSet = {
      checked: null,
      unchecked: null,
      button: null
    };
    this.settings = [1, 1, 1];  //загружаются из localStorage
    // this.settings[0] = 1; //музыка включена
    // this.settings[1] = 1; //звуки включены
    // this.settings[2] = 1; //вибрация включена
  }

  initPageSet() {
    this.isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
    this.spa.playMelody();
    this.start();
    this.setCursor();
    this.preloadSetPageData(() => {
      this.loadSet();
    })
  }

  loadSet() {
    this.renderBackground();
    this.loadCheckedImg();
    this.addListeners();
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

  reRunSetPage() {
    this.initDimensions();
    this.renderBackground();
    this.renderSetPage();
  }

  addListeners() {
    this.checkClickCheckThis = this.checkClickCheck.bind(this);
    this.canvas.addEventListener('click', this.checkClickCheckThis);
    this.reRunSetPageCont = this.reRunSetPage.bind(this);
    window.addEventListener('resize', this.reRunSetPageCont);
  }

  removeListeners() {
    this.canvas.removeEventListener('click', this.checkClickCheckThis);
    window.removeEventListener('resize', this.reRunSetPageCont);
  }

  checkClickCheck(e) {
    let zoom = this.calcZoom();

    for (let j = 0; j <= 1 + this.isMobile; j++) {
      if (this.checkBorders(e, zoom, j)) {
        this.showResult(j);
      }
    }
    if (this.checkBordersButton(e, zoom)) {
      this.returnMenu();
    }
  }

  checkBorders(e, k, number) {
    let borderLeft = e.pageX * k > this.X2;
    let borderRight = e.pageX * k < this.X2 + this.checkSize;
    let borderTop = e.pageY * k > this.Y[number];
    let borderBottom = e.pageY * k < this.Y[number] + this.checkSize;
    return borderLeft && borderRight && borderTop && borderBottom;
  }

  checkBordersButton(e, k) {
    let borderLeft = e.pageX * k > this.butX;
    let borderRight = e.pageX * k < this.butX + this.buttonWidth;
    let borderTop = e.pageY * k > this.butY;
    let borderBottom = e.pageY * k < this.butY + this.buttonHeight;
    return borderLeft && borderRight && borderTop && borderBottom;
  }

  calcZoom() {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = this.canvas.getBoundingClientRect();
    return oldCanvas.width / currentSizes.width;
  }

  showResult(num) {
    this.settings[num] = (this.settings[num] === 1) ? 0 : 1;
    if (num === 1 && this.settings[1] === 1) {
      this.spa.playClick(num);
    }
    if (num === 2 && this.settings[2] === 1) {
      this.spa.playClick(num);
    }
    this.spa.saveSettings();
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
      this.textSetSize = this.width / 38;
      this.X1 = this.width / 4;
      this.Y1 = this.textSetSize * 3;
    }
    if (aspectRatioWindow > 1.5) {
      this.textSetSize = this.height / 30;
      this.X1 = this.width / 3;
      this.Y1 = this.textSetSize * 3;
    }
    this.X2 = this.width - this.X1 - this.textSetSize * 1.5;
    this.checkSize = this.textSetSize * 2;
    this.ctx.font = `${this.textSetSize * 1.5}px ${this.font}`;
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
    this.Y[2] = this.Y[1] + this.textSetSize * 5;
    let text3 = 'VIBRATION';
    let text4 = '(only for phones)';
    currYText = this.Y[2] + this.checkSize / 1.5;
    this.renderSetText(text3, this.X1, currYText, this.textSetSize * 1.5, this.colors.osloGrayL, Al);
    currYText += this.textSetSize * 1.5;
    this.renderSetText(text4, this.X1, currYText, this.textSetSize, this.colors.osloGrayL, Al);
    let Alpha = (this.isMobile) ? 1 : 0.2;
    this.renderChecked(this.checkedImg[this.settings[2]], this.X2, this.Y[2], Alpha);
    this.butY = this.height - this.textSetSize * 5;
    let aspectRatioButton = this.imgSet.button.width / this.imgSet.button.height;
    this.buttonHeight = this.checkSize;
    this.buttonWidth = this.buttonHeight * aspectRatioButton;
    this.butX = (this.width - this.buttonWidth) / 2;
    this.renderButtonReturn(this.butX, this.butY);
    let text5 = 'HOME';
    Al = 'center';
    currentX = this.butX + this.buttonWidth / 2;
    currentY = this.butY + this.buttonHeight / 2;
    this.renderSetText(text5, currentX, currentY, this.textSetSize / 1.2, this.colors.gallery, Al);
  }

  renderButtonReturn(X, Y) {
    window.requestAnimationFrame(() => {
      this.ctx.drawImage(this.imgSet.button, X, Y, this.buttonWidth, this.buttonHeight);
    });
  }

  renderSetText(text, currentX, currentY, textSize, color, Align) {
    window.requestAnimationFrame(() => {
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = Align;
      this.ctx.font = `${textSize}px ${this.font}`;
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = 1;
      this.ctx.fillText(text, currentX, currentY);
    });
  }

  renderChecked(img, X, Y, Alpha = 1) {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = Alpha;
      this.ctx.drawImage(img, X, Y, this.checkSize, this.checkSize);
      this.ctx.globalAlpha = 1;
    });
  }

  returnMenu() {
    this.spa.playClick();
    this.removeListeners();
    this.spa.switchToMainPage();
  }
}