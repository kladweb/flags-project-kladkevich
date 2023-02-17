import {Component} from './Component.js';
import {Game} from './Game.js';

export class MainMenu extends Component {
  constructor(spa) {
    super();
    this.spa = spa;
    this.logoWidth = 300; //предварительные размеры логотипа
    this.logoHeight = 200;
    this.butWidth = 0; //размеры кнопок главного меню
    this.butHeight = 0;
    this.butNames = ['PLAY', 'HI SCORES', 'SETTINGS', 'ABOUT'];
    this.imgM = {
      logo: null,
      button: null
    };
    this.activeButton = [0, 0, 0, 0];
    // self = this;
  }

  initMenu() {
    this.start();
    this.reRunMenuCont = this.reRunMenu.bind(this);
    window.addEventListener('resize', this.reRunMenuCont);
    this.preloadStartData(() => {
      this.loadMenuData();
    });
  }

  preloadStartData(callback) {
    this.imageBackground = new Image();
    this.imageBackground.src = `img/shared/background.png`;
    this.imageBackground.addEventListener('load', callback);
  }

  loadMenuData() {
    this.renderBackground();
    this.renderLoader();
    this.setCursor();
    this.preloadMenuData(() => {
      this.runMenu();
    });
  }

  preloadMenuData(callback) {
    let loaded = 0;
    let required = Object.keys(this.imgM).length;
    const onAssetLoad = () => {
      ++loaded;
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadImages(onAssetLoad);
  }

  preloadImages(onAssetLoadCallback) {
    for (let key in this.imgM) {
      this.imgM[key] = new Image();
      this.imgM[key].src = 'img/shared/' + key + '.png';
      this.imgM[key].addEventListener('load', onAssetLoadCallback);
    }
  }

  runMenu() {
    this.createMenuSizes();
    this.addListeners();
    this.renderMenu();
  }

  reRunMenu() {
    this.initDimensions();
    this.createMenuSizes();
    this.renderMenu();
  }

  renderMenu() {
    const promise = new Promise(res => res());
    promise.then(() => {
      this.renderBackground();
      // console.log('рендер промис');
    })
    .then(() => {
      this.renderLogo();
    })
    .then(() => {
      this.renderTitle();
    })
    .then(() => {
      this.renderMenuButtons();
    });
  }

  createMenuSizes() {
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    let aspectRatioLogo = this.imgM.logo.width / this.imgM.logo.height;
    let aspectRatioButton = this.imgM.button.width / this.imgM.button.height;
    if (aspectRatioWindow <= 0.5) {
      console.log('|', aspectRatioWindow);
      this.logoWidth = this.width * 0.6;
      this.logoHeight = this.logoWidth / aspectRatioLogo;
      this.logoOffsetY = (this.height - this.logoHeight * 2) / 2;
      this.logoOffsetX = (this.width - this.logoWidth) / 2;

      this.titleSize = this.width / 12;
      this.offsetXTitle = this.width / 2;
      this.offsetYTitle = this.logoOffsetY / 2;

      this.butWidth = this.logoWidth;
      this.butHeight = this.butWidth / aspectRatioButton;
      this.butOffsetX = [];
      this.butOffsetY = [];
      for (let i = 0; i <= 3; i++) {
        this.butOffsetX[i] = (this.width - this.butWidth) / 2;
        this.butOffsetY[i] = this.logoOffsetY + this.logoHeight + this.butHeight * 0.5 + this.butHeight * 1.25 * i;
      }
    }
    if (aspectRatioWindow > 0.5 && aspectRatioWindow <= 1.5) {
      console.log('|', aspectRatioWindow);
      this.logoWidth = this.width * 0.5 / ((aspectRatioWindow < 1) ? 1 : aspectRatioWindow);
      this.logoHeight = this.logoWidth / aspectRatioLogo;
      this.logoOffsetY = (this.height - this.logoHeight * 1.5) / 2;
      this.logoOffsetX = (this.width - this.logoWidth) / 2;

      this.titleSize = this.width / 12 / ((aspectRatioWindow < 1) ? 1 : aspectRatioWindow);
      this.offsetXTitle = this.width / 2;
      this.offsetYTitle = this.logoOffsetY / 2;

      this.butWidth = this.logoWidth / 1.2;
      this.butHeight = this.butWidth / aspectRatioButton;
      this.butOffsetX = [];
      this.butOffsetY = [];
      for (let i = 0; i <= 1; i++) {
        let offsetBut = (this.width - this.butWidth * 2) / 5;
        this.butOffsetX[0] = this.butOffsetX[2] = offsetBut * 2;
        this.butOffsetX[1] = this.butOffsetX[3] = offsetBut * 3 + this.butWidth;
        this.butOffsetY[1] = this.butOffsetY[0] = this.logoOffsetY + this.logoHeight + this.butHeight * 0.5;
        this.butOffsetY[2] = this.logoOffsetY + this.logoHeight + this.butHeight * 0.5 + this.butHeight * 1.25;
        this.butOffsetY[3] = this.butOffsetY[2];
      }
    }

    if (aspectRatioWindow > 1.5) {
      // console.log('---', aspectRatioWindow);
      this.logoHeight = this.height / 2;
      this.logoWidth = this.logoHeight * aspectRatioLogo;
      this.logoOffsetY = (this.height - this.logoHeight) / 2;
      this.logoOffsetX = (this.width - this.logoWidth) / 4;

      this.titleSize = this.width / 25;
      this.offsetXTitle = this.width / 2;
      this.offsetYTitle = this.logoOffsetY / 2;

      this.butHeight = this.logoHeight / 4.75;
      this.butWidth = this.butHeight * aspectRatioButton;
      this.butOffsetX = [];
      this.butOffsetY = [];
      for (let i = 0; i <= 3; i++) {
        this.butOffsetX[i] = this.width - this.logoOffsetX - this.butWidth;
        this.butOffsetY[i] = this.logoOffsetY + this.butHeight * 1.25 * i;
      }
    }
  }

  renderTitle() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${this.titleSize}px Arial`;
      this.ctx.fillStyle = this.colors.green;
      this.ctx.fillText(`GUESS THE COUNTRY`, this.offsetXTitle, this.offsetYTitle);
    });
  }

  renderLogo() {
    window.requestAnimationFrame(() => {
      this.ctx.drawImage(this.imgM.logo, this.logoOffsetX, this.logoOffsetY, this.logoWidth, this.logoHeight);
    });
  }

  renderMenuButtons() {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 0.75;
      for (let i = 0; i <= 3; i++) {
        this.renderButton(this.imgM.button, this.butOffsetX[i], this.butOffsetY[i], this.butWidth, this.butHeight);
      }
      this.ctx.globalAlpha = 1;
      const textSize = this.butHeight / 2.5;
      this.ctx.font = `${textSize}px Arial`;
      this.ctx.fillStyle = this.colors.gallery;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      for (let i = 0; i <= 3; i++) {
        let currentTextX = this.butOffsetX[i] + this.butWidth / 2;
        let currentTextY = this.butOffsetY[i] + this.butHeight / 1.8;
        this.renderButtonText(`${this.butNames[i]}`, currentTextX, currentTextY);
      }
    })
  }

  renderButton(image, offsetX, offsetY, width, height) {
    this.ctx.drawImage(image, offsetX, offsetY, width, height);
  }

  renderButtonText(text, currentX, currentY) {
    this.ctx.fillText(text, currentX, currentY);
  }

  addListeners() {
    this.checkClickAnswerThis = this.checkClickAnswer.bind(this);
    this.checkMoveAnswerThis = this.checkMoveAnswer.bind(this);
    this.canvas.addEventListener('click', this.checkClickAnswerThis);
    this.canvas.addEventListener('mousemove', this.checkMoveAnswerThis);
  }

  removeListeners() {
    console.log('удалили слушателей меню');
    this.canvas.removeEventListener('click', this.checkClickAnswerThis);
    this.canvas.removeEventListener('mousemove', this.checkMoveAnswerThis);
  }

  checkClickAnswer(e) {
    let zoom = this.calcZoom();
    for (let j = 0; j <= 3; j++) {
      if (this.checkBorders(e, zoom, j)) {
        console.log('Variant', j, 'click');
        this.showResult(j);
      }
    }
  }

  checkMoveAnswer(e) {
    let zoom = this.calcZoom();
    for (let i = 0; i <= 3; i++) {
      if (this.checkBorders(e, zoom, i)) {
        if (this.activeButton[i] !== 1) {
          e.target.style.cursor = 'url(../img/cursors/earth-pointer.png), pointer';
          this.ctx.globalAlpha = 1;
          this.renderButton(this.imgM.button, this.butOffsetX[i], this.butOffsetY[i], this.butWidth, this.butHeight);
          let currentTextX = this.butOffsetX[i] + this.butWidth / 2;
          let currentTextY = this.butOffsetY[i] + this.butHeight / 1.8;
          this.renderButtonText(`${this.butNames[i]}`, currentTextX, currentTextY);
          this.activeButton[i] = 1;
        }
      } else {
        if (this.activeButton[i] === 1) {
          e.target.style.cursor = 'url(../img/cursors/earth-cursor.png), default';
          this.renderMenu();
          this.activeButton[i] = 0;
        }
      }
    }
  }

  calcZoom() {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = this.canvas.getBoundingClientRect();
    return oldCanvas.width / currentSizes.width;
  }

  checkBorders(e, k, number) {
    let borderLeft = e.pageX * k > this.butOffsetX[number];
    let borderRight = e.pageX * k < this.butOffsetX[number] + this.butWidth;
    let borderTop = e.pageY * k > this.butOffsetY[number];
    let borderBottom = e.pageY * k < this.butOffsetY[number] + this.butHeight;
    return borderLeft && borderRight && borderTop && borderBottom;
  }

  showResult(num) {
    // this.removeListeners();
    if (num === 0) {
      this.spa.switchToGamePage();
    }
    if (num === 1) {
      this.spa.switchToHiScorePage();
    }
    if (num === 2) {
      this.spa.switchSettingsPage();
    }
    if (num === 3) {
      this.spa.switchAboutPage();
    }
  }
}