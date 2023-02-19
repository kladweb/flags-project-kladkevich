import {Component} from './Component.js';

export class About extends Component {
  constructor(spa) {
    super();
    this.spa = spa;
    this.textAbout = [];
    this.textAbout[0] = 'RULES OF THE GAME';
    this.textAbout[1] = 'Guess as many country flags as possible. Perhaps you will become the best quiz player! ' +
      'There is no time limit for guessing the flag! I wish you good luck!';
    this.textAbout[2] = 'ABOUT THE PROJECT';
    this.textAbout[3] = 'This game was created as the final project of the course \"Development of Web' +
      ' Applications in JavaScript\" with using canvas graphics. This project was developed by Pavel Kladkevich' +
      ' under the guidance of the teacher Aliaksandr Stashkevich.'
    this.textAbout[4] = '\"To travel is to live\" - Hans Christian Andersen';
    this.textAbout[5] = 'TAP or CLICK to return...';
  }

  initAbout() {
    this.start();
    this.reRunAboutCont = this.reRunAbout.bind(this);
    window.addEventListener('resize', this.reRunAboutCont);
    this.preloadStartData(() => {
      this.loadAbout();
    });
  }

  reRunAbout() {
    this.initDimensions();
    this.renderBackground();
    this.renderAbout();
    this.renderQuote();
    this.renderMessageBack();
  }

  preloadStartData(callback) {
    this.imageBackground = new Image();
    this.imageBackground.src = `img/shared/background.png`;
    this.imageBackground.addEventListener('load', callback);
  }

  loadAbout() {
    this.renderBackground();
    this.setCursor();
    this.renderAbout();
    this.renderQuote();
    console.log('СЛУШАТЕЛЬ !!!');
    this.addListenerForBack();
  }


  renderAbout() {
    let marginLeft;
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    if (aspectRatioWindow <= 0.5) {
      this.widthAbout = this.width * 0.9;
      marginLeft = this.width * 0.1 / 2;
      this.aboutSize = this.widthAbout / 20;
    }
    if (aspectRatioWindow > 0.5 && aspectRatioWindow <= 1) {
      this.widthAbout = this.width * 0.8;
      marginLeft = this.width * 0.2 / 2;
      this.aboutSize = this.widthAbout / 25;
    }
    if (aspectRatioWindow > 1 && aspectRatioWindow <= 1.5) {
      this.widthAbout = this.width * 0.7;
      marginLeft = this.width * 0.3 / 2;
      this.aboutSize = this.widthAbout / 30;
    }
    if (aspectRatioWindow > 1.5) {
      this.widthAbout = this.width * 0.6;
      marginLeft = this.width * 0.4 / 2;
      this.aboutSize = this.height / 30;
    }
    let marginTop = this.aboutSize * 2;
    let lineHeight = this.aboutSize * 1.5;

    this.ctx.font = `${this.aboutSize * 1.5}px ${this.font}`;
    let testWidth = this.ctx.measureText(this.textAbout[0]).width;
    let headOffsetX = (this.width - testWidth) / 2;
    this.renderAboutText(this.textAbout[0], headOffsetX, marginTop, this.aboutSize * 1.5, this.colors.gallery);
    marginTop += this.aboutSize * 2;

    let words = this.textAbout[1].split(' ');
    let countWords = words.length;
    let line = '';
    for (let n = 0; n < countWords; n++) {
      let testLine = line + words[n] + ' ';
      this.ctx.font = `${this.aboutSize}px ${this.font}`;
      this.ctx.fillStyle = this.colors.gallery;
      testWidth = this.ctx.measureText(testLine).width;
      if (testWidth > this.widthAbout) {
        this.renderAboutText(line, marginLeft, marginTop, this.aboutSize, this.colors.gallery);
        line = words[n] + ' ';
        marginTop += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.renderAboutText(line, marginLeft, marginTop, this.aboutSize);
    marginTop += this.aboutSize * 5;

    this.ctx.font = `${this.aboutSize * 1.5}px ${this.font}`;
    testWidth = this.ctx.measureText(this.textAbout[2]).width;
    headOffsetX = (this.width - testWidth) / 2;
    this.renderAboutText(this.textAbout[2], headOffsetX, marginTop, this.aboutSize * 1.5);
    marginTop += this.aboutSize * 2;

    words = this.textAbout[3].split(' ');
    countWords = words.length;
    line = '';
    for (let n = 0; n < countWords; n++) {
      let testLine = line + words[n] + ' ';
      this.ctx.font = `${this.aboutSize}px ${this.font}`;
      this.ctx.fillStyle = this.colors.gallery;
      testWidth = this.ctx.measureText(testLine).width;
      if (testWidth > this.widthAbout) {
        this.renderAboutText(line, marginLeft, marginTop, this.aboutSize, this.colors.gallery);
        line = words[n] + ' ';
        marginTop += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.renderAboutText(line, marginLeft, marginTop, this.aboutSize, this.colors.gallery);
    this.marginTop = marginTop += this.aboutSize * 2;
  }

  renderQuote() {
    this.ctx.font = `${this.aboutSize}px ${this.font}`;
    this.ctx.fillStyle = this.colors.gallery;
    let marginLeft = this.width - this.ctx.measureText(this.textAbout[4]).width - this.aboutSize;
    let marginTop = this.height - this.getFontHeight(this.ctx.font);
    this.renderAboutText(this.textAbout[4], marginLeft, marginTop, this.aboutSize, this.colors.gallery);
  }

  getFontHeight(font) {
    let parent = document.createElement('span');
    parent.appendChild(document.createTextNode('height'));
    document.body.appendChild(parent);
    parent.style.cssText = "font: " + font + "; white-space: nowrap; display: inline;";
    let height = parent.offsetHeight;
    document.body.removeChild(parent);
    return height;
  }

  renderAboutText(text, currentX, currentY, aboutSize, color) {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'left';
      this.ctx.font = `${aboutSize}px ${this.font}`;
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, currentX, currentY);
    });
  }

  addListenerForBack() {
    this.renderMessageBack();
    this.checkBackCont = this.checkBack.bind(this);
    this.canvas.addEventListener('click', this.checkBackCont);
  }

  renderMessageBack() {
    this.ctx.fillStyle = this.colors.osloGray;
    this.ctx.font = `${this.aboutSize * 1.5}px ${this.font}`;
    let testWidth = this.ctx.measureText(this.textAbout[5]).width;
    let currentTextX = (this.width - testWidth) / 2;
    let currentTextY = this.marginTop + this.aboutSize;
    this.renderAboutText(this.textAbout[5], currentTextX, currentTextY, this.aboutSize * 1.5, this.colors.osloGray);
  }

  checkBack() {
    this.spa.playClick();
    this.canvas.removeEventListener('click', this.checkBackCont);
    setTimeout(() => {
      this.spa.switchToMainPage();
    }, 100);
  }
}