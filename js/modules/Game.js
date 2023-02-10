import {Component} from './Component.js';
import {flagsAll} from './flagsAll.js';

export class Game extends Component {
  constructor() {
    super();
    this.flagsAll = flagsAll;  //объект, содержащий все флаги
    this.unsolvedFlags = flagsAll;  //объект, содержащий неразгаданные флаги
    this.imgFlags = []; //загруженные флаги
    this.activeFlag = null; //рандомный флаг (рандомный ключ объекта imagesFlags)
    this.activeImgFlag = null; //img для отрисовки текущего флага
    this.flagWidth = 500;  //предварительная ширина флага
    this.flagHeight = 300;  //предварительная высота флага
    this.flagOffsetX = 0;  //координаты верхнего левого угла флага
    this.flagOffsetY = 0;
    this.frameWidth = 20;  //толщина белой рамки вокруг флага
    this.allowPrompt = true; //запрет покидания страницы

    this.boxWidth = 0; //ширина рамки с вариантом ответа
    this.boxHeight = 0; //высота рамки с вариантом ответа
    this.boxDist = 0;  //расстояние между рамками с ответами
    this.boxFrameSize = 3.5  //толщина рамки вокруг варианта ответа
    this.boxOffsetX = [];
    this.boxOffsetY = [];
    this.levelGame = 4;
    this.answerOptions = [];
    this.activeAnswer = [];
  }

  initGame() {
    this.start();
    setTimeout(() => {
      this.renderLoader();
    }, 0);
    this.preloadFlags(() => {
      this.runGame();
    });
  }

  preloadFlags(callback) {
    let loaded = 0;
    let required = Object.keys(this.flagsAll).length;
    const onAssetLoad = () => {
      ++loaded;
      // console.log(loaded);
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadImages(onAssetLoad);
  }

  preloadImages(onAssetLoadCallback) {
    for (let key in this.flagsAll) {
      this.imgFlags[key] = new Image();
      this.imgFlags[key].src = `../../img/flags/${key}.png`;
      this.imgFlags[key].addEventListener('load', onAssetLoadCallback);
    }
  }

  runGame() {
    this.getRandomFlag();
    this.createGameSizes();
    this.renderBackground();
    this.renderFlag();
    this.getRandomAnswers();
    this.createAnswers();
    this.renderAnswers();
  }

  getRandomFlag() {
    let numberActiveFlag = Math.floor(Math.random() * (Object.keys(this.unsolvedFlags).length));
    this.activeFlag = Object.keys(this.unsolvedFlags)[numberActiveFlag];
    // this.getRandomAnswers();
  }


  preloadActiveFlag() {
    this.activeImgFlag = this.imgFlags[this.activeFlag];
  }

  createGameSizes() {
    this.preloadActiveFlag();
    let aspectRatioWindow = window.innerWidth / window.innerHeight;
    if (aspectRatioWindow <= 1) {
      this.flagWidth = this.width * 0.8;
      this.flagHeight = this.flagWidth / 2;
    }
    if (aspectRatioWindow > 1) {
      this.flagHeight = this.height / 3;
      this.flagWidth = this.flagHeight * 2;
    }
    const flagWidth = Math.min(this.width, this.flagWidth);
    this.flagOffsetX = (this.width - flagWidth) / 2;
    this.flagOffsetY = (this.height - this.flagHeight * 1.6) / 2;
  }

  renderFlag() {
    window.requestAnimationFrame(() => {
      let aspectRatioFlag = this.activeImgFlag.width / this.activeImgFlag.height;
      let imageWidth = this.flagHeight * aspectRatioFlag;
      let imageX = this.flagOffsetX + (this.flagWidth - imageWidth) / 2;
      this.ctx.globalAlpha = 0.3;
      this.ctx.strokeStyle = this.colors.gallery;
      this.ctx.fillStyle = this.colors.gallery;
      this.ctx.lineWidth = this.frameWidth;
      this.ctx.lineJoin = 'round';
      this.ctx.strokeRect(this.flagOffsetX, this.flagOffsetY, this.flagWidth, this.flagHeight);
      const XFill = this.flagOffsetX + this.frameWidth / 2;
      const YFill = this.flagOffsetY + this.frameWidth / 2;
      this.ctx.fillRect(XFill, YFill, this.flagWidth - this.frameWidth, this.flagHeight - this.frameWidth);
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(this.activeImgFlag, imageX, this.flagOffsetY, imageWidth, this.flagHeight);
    });
  }

  //*******************************************************

  getRandomAnswers() {
    this.activeAnswer[0] = 0;
    this.answerOptions[0] = (this.activeFlag);
    //из строки выше у нас есть массив с одним правильным ответом. Дополним этот массив другими рандомными
    // вариантами ответов:
    for (let i = 1; i < this.levelGame; i++) {
      let randomNumberFlag = Math.floor(Math.random() * (Object.keys(this.flagsAll).length));
      let randomAnswer = Object.keys(this.flagsAll)[randomNumberFlag];
      if (this.answerOptions.indexOf(randomAnswer) === -1) {
        this.answerOptions[i] = (randomAnswer);
        this.activeAnswer.push(0);
      } else {
        i--;
      }
    }
    //перемешаем этот массив, чтобы правильный вариант ответа не всегда был на первом месте, т.е. находился на
    // произвольной позиции. Для этого используем алгоритм «Тасование Фишера — Йетса»:
    for (let i = this.answerOptions.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.answerOptions[i], this.answerOptions[j]] = [this.answerOptions[j], this.answerOptions[i]];
    }
  }

  createAnswers() {
    this.boxDist = this.flagWidth / 25;
    this.boxWidth = (this.flagWidth + this.frameWidth) / 2 - this.boxFrameSize - this.boxDist / 2;
    this.boxHeight = this.boxWidth / 5;
    this.boxOffsetX[0] = this.flagOffsetX - (this.frameWidth - this.boxFrameSize) / 2;
    this.boxOffsetY[0] = this.flagOffsetY + this.flagHeight + this.frameWidth / 2 + this.boxDist * 2;
    this.boxOffsetX[1] = this.boxOffsetX[0] + this.boxWidth + this.boxFrameSize + this.boxDist;
    this.boxOffsetY[1] = this.boxOffsetY[0];
    this.boxOffsetX[2] = this.boxOffsetX[0];
    this.boxOffsetY[2] = this.boxOffsetY[0] + this.boxHeight + this.boxFrameSize + this.boxDist;
    this.boxOffsetX[3] = this.boxOffsetX[1];
    this.boxOffsetY[3] = this.boxOffsetY[2];
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  }

  renderAnswers() {
    for (let i = 0; i < this.levelGame; i++) {
      this.renderAnswer(i, this.colors.osloGray, this.colors.spicyMix, this.colors.gallery);
    }
  }

  renderAnswer(num, colorFrame, colorFill, colorText) {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 1;
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = this.boxFrameSize;
      this.ctx.strokeStyle = colorFrame;
      this.ctx.fillStyle = colorFill;
      this.ctx.fillRect(this.boxOffsetX[num], this.boxOffsetY[num], this.boxWidth, this.boxHeight);
      this.ctx.strokeRect(this.boxOffsetX[num], this.boxOffsetY[num], this.boxWidth, this.boxHeight);
    });
    window.requestAnimationFrame(() => {
      this.ctx.fillStyle = colorText;
      this.ctx.textAlign = 'center';
      const answerSize = this.boxWidth / 15;
      this.ctx.font = `${answerSize}px Arial`;
      let currentTextX = this.boxOffsetX[num] + this.boxWidth / 2;
      let currentTextY = this.boxOffsetY[num] + this.boxHeight / 2;
      this.ctx.fillText(this.flagsAll[this.answerOptions[num]], currentTextX, currentTextY);
    });
  }
  // startGame() {
  //   this.initGame();
  // }
}