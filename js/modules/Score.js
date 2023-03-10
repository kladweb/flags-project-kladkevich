import {Component} from './Component.js';

export class Score extends Component {
  constructor(spa) {
    super();
    this.spa = spa;
    this.scList = null; //массив со списком рекордов;
    this.textScore = ['THE BEST PLAYERS', 'NAME', 'SCORE', 'GAME DATE'];
  }

  initScore() {
    this.start();
    this.renderScore();
    this.reRunAScoreCont = this.reRunScore.bind(this);
    window.addEventListener('resize', this.reRunAScoreCont);
  }

  renderScore() {
    this.preloadSetPageData(() => {
      this.createPageScore();
    });
  }

  reRunScore() {
    this.initDimensions();
    this.renderBackground();
    this.setCursor();
    this.renderScorePage();
    this.renderMessageBack();
  }

  createPageScore() {
    this.setCursor();
    this.renderBackground();
    this.renderLoader();
    this.preloadAjaxStorageData();
  }

  preloadAjaxStorageData() {
    this.spa.storage.loadData()
    .then((encData) => {
      if (encData) {
        this.scList = JSON.parse(encData.result);
      } else {
        this.scList = false;
      }
    })
    .then(() => {
      this.renderBackground();
      this.renderScorePage();
      this.addListenerScoreBack();
    });
  }

  renderScorePage() {
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    if (aspectRatioWindow <= 0.5) {
      this.fieldWidth = this.width * 0.9;
      this.textScSize = this.fieldWidth / 25;
      this.fieldHeight = this.height / 2;
      this.frCurrY = this.textScSize * 3;
    }
    if (aspectRatioWindow > 0.5 && aspectRatioWindow <= 1) {
      this.fieldWidth = this.width * 0.8;
      this.textScSize = this.fieldWidth / 25;
      this.fieldHeight = this.height / 1.5;
      this.frCurrY = this.textScSize * 3;
    }
    if (aspectRatioWindow > 1 && aspectRatioWindow <= 1.5) {
      this.fieldWidth = this.width * 0.7;
      this.textScSize = this.fieldWidth / 30;
      this.fieldHeight = this.height - this.textScSize * 2;
      this.frCurrY = (this.height - this.fieldHeight) / 2;
    }
    if (aspectRatioWindow > 1.5) {
      this.fieldWidth = this.width * 0.6;
      this.textScSize = this.height / 30;
      this.fieldHeight = this.height - this.textScSize * 2;
      this.frCurrY = (this.height - this.fieldHeight) / 2;
    }
    this.frCurrX = (this.width - this.fieldWidth) / 2;
    if (this.scList === false) {
      this.renderFail();
      this.renderMessageBack();
      this.addListenerScoreBack();
    }
    this.renderFrameScore();
    this.ctx.font = `${this.textScSize * 1.5}px ${this.font}`;
    let testWidth = this.ctx.measureText(this.textScore[0]).width;
    let currentX = (this.width - testWidth) / 2;
    let currentY = this.frCurrY + this.textScSize * 3;
    let Al = 'left';
    this.renderScText(this.textScore[0], currentX, currentY, this.textScSize * 1.5, this.colors.green, Al);
    this.renderTableRecords();
  }

  renderScText(text, currentX, currentY, textSize, color, Align) {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = Align;
      this.ctx.font = `${textSize}px ${this.font}`;
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = 1;
      this.ctx.fillText(text, currentX, currentY);
    });
  }

  renderFrameScore() {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillStyle = this.colors.osloGrayL;
      this.ctx.fillRect(this.frCurrX, this.frCurrY, this.fieldWidth, this.fieldHeight);
      this.ctx.globalAlpha = 1;
    });
  }

  renderTableRecords() {
    let currX = [];
    let currY = [];
    currX[0] = (this.width - this.fieldWidth) / 2 + (this.fieldWidth / 3) / 2;
    currX[1] = (this.width - this.fieldWidth) / 2 + (this.fieldWidth / 3) * 1.5;
    currX[2] = (this.width - this.fieldWidth) / 2 + (this.fieldWidth / 3) * 2.5;
    currY[0] = this.frCurrY + this.textScSize * 6;
    let Al = 'center';
    this.renderScText(this.textScore[1], currX[0], currY[0], this.textScSize * 1.2, this.colors.white, Al);
    this.renderScText(this.textScore[2], currX[1], currY[0], this.textScSize * 1.2, this.colors.white, Al);
    this.renderScText(this.textScore[3], currX[2], currY[0], this.textScSize * 1.2, this.colors.white, Al);

    currX[4] = (this.width - this.fieldWidth) / 2 + this.textScSize * 2;
    let distRecords = (this.fieldHeight + this.frCurrY - currY[0]) / 6;
    for (let i = 1; i <= 5; i++) {
      currY[i] = currY[0] + distRecords * i;
    }

    for (let i = 0; i < 5; i++) {
      let color = this.colors.gallery
      this.renderScText(this.scList[i].user, currX[4], currY[i + 1], this.textScSize, color, 'left');
      this.renderScText(this.scList[i].score, currX[1], currY[i + 1], this.textScSize, color, 'center');
      this.renderScText(this.scList[i].date, currX[2], currY[i + 1], this.textScSize, color, 'center');
    }
  }

  renderFail() {
    let text = 'Problem getting data from the server';
    let currX = (this.width - this.fieldWidth) / 2 + (this.fieldWidth / 3) * 1.5;
    let currY = this.frCurrY + this.textScSize * 15;
    this.renderScText(text, currX, currY, this.textScSize * 1.2, this.colors.white, 'center');
  }

  addListenerScoreBack() {
    this.renderMessageBack();
    this.checkScoreToBackCont = this.checkScoreToBack.bind(this);
    this.canvas.addEventListener('click', this.checkScoreToBackCont);
  }

  renderMessageBack() {
    this.ctx.fillStyle = this.colors.osloGray;
    this.ctx.font = `${this.aboutSize * 1.5}px ${this.font}`;
    let currentTextX = this.width / 2;
    let currentTextY = this.height - this.textScSize * 2;
    const textBack = 'TAP or CLICK to return...';
    const color = this.colors.white;
    this.renderScText(textBack, currentTextX, currentTextY, this.aboutSize * 1.5, color, 'center');
  }

  checkScoreToBack() {
    this.spa.media.playClick();
    this.canvas.removeEventListener('click', this.checkScoreToBackCont);
    setTimeout(() => {
      this.spa.switchToMainPage();
    }, 100);
  }
}