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
    this.boxOffsetX = [];  //координаты рамок с ответами
    this.boxOffsetY = [];
    this.levelGame = 4;
    this.currentRender = [0, 0, 0];  //текущее состояние для resize
    this.scoreDefault = 0;
    this.liveDefault = 2;
    this.score = 0;
    this.live = 0;
    this.answerOptions = [];
    this.activeAnswer = [];
    this.imgGame = {
      human: null,
      button: null
    };
  }

  initGame() {
    this.start();
    this.live = this.liveDefault;
    this.score = this.scoreDefault;
    window.addEventListener('resize', this.reRunGame.bind(this));
    this.preloadStartData(() => {
      this.renderBackground();
      this.renderLoader();
      this.loadImgData();
    });
  }

  preloadStartData(callback) {
    this.imageBackground = new Image();
    this.imageBackground.src = `img/shared/background.png`;
    this.imageBackground.addEventListener('load', callback);
  }

  loadImgData() {
    this.preloadImgFiles(() => {
      this.startGame();
    });
  }

  preloadImgFiles(callback) {
    let loaded = 0;
    let required = Object.keys(this.flagsAll).length;
    required += Object.keys(this.imgGame).length;
    const onAssetLoad = () => {
      ++loaded;
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadImages(onAssetLoad);
  }

  preloadImages(onAssetLoadCallback) {
    for (let key in this.imgGame) {
      this.imgGame[key] = new Image();
      this.imgGame[key].src = 'img/shared/' + key + '.png';
      this.imgGame[key].addEventListener('load', onAssetLoadCallback);
    }
    for (let key in this.flagsAll) {
      this.imgFlags[key] = new Image();
      this.imgFlags[key].src = `../../img/flags/${key}.png`;
      this.imgFlags[key].addEventListener('load', onAssetLoadCallback);
    }
  }

  startGame() {
    this.currentRender = [0, 0, 0];
    this.getRandomFlag();
    this.getRandomAnswers();
    this.runGame();
  }

  runGame() {
    this.createGameSizes();
    this.renderBackground();
    this.renderFrame();
    this.renderFlag();
    this.renderScore();
    this.renderLive();
    this.createAnswers();
    this.renderAnswers();
    this.addListeners();
  }

  reRunGame() {
    switch (this.currentRender[0]) {
      case 0:
        this.initDimensions();
        this.runGame();
        break;
      case 1:
        this.initDimensions();
        this.createGameSizes();
        this.renderBackground();
        this.renderFrame();
        this.renderFlag();
        this.renderScore();
        this.renderLive();
        this.createAnswers();
        this.renderAnswers();
        this.renderArrowWrong(this.currentRender[1]);
        this.reRenderResultColor(this.currentRender[1], this.currentRender[2]);
        this.continueGame();
        break;
      case 2:
        this.initDimensions();
        this.createGameSizes();
        this.renderBackground();
        this.renderFrame();
        this.renderFlag();
        this.renderScore();
        this.renderLive();
        this.createAnswers();
        this.renderAnswers();
        this.renderArrowRight1(this.currentRender[1]);
        this.renderArrowRight2(this.currentRender[1]);
        this.reRenderResultColor(this.currentRender[1], this.currentRender[2]);
        this.renderMessageContinue();
        break;
      case 3:
        this.initDimensions();
        this.createGameSizes();
        this.createAnswers();
        this.finishGame();
    }
  }

  getRandomFlag() {
    let numberActiveFlag = Math.floor(Math.random() * (Object.keys(this.unsolvedFlags).length));
    this.activeFlag = Object.keys(this.unsolvedFlags)[numberActiveFlag];
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

  renderFrame() {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 0.3;
      this.ctx.strokeStyle = this.colors.gallery;
      this.ctx.fillStyle = this.colors.gallery;
      this.ctx.lineWidth = this.frameWidth;
      this.ctx.lineJoin = 'round';
      this.ctx.strokeRect(this.flagOffsetX, this.flagOffsetY, this.flagWidth, this.flagHeight);
      const XFill = this.flagOffsetX + this.frameWidth / 2;
      const YFill = this.flagOffsetY + this.frameWidth / 2;
      this.ctx.fillRect(XFill, YFill, this.flagWidth - this.frameWidth, this.flagHeight - this.frameWidth);
    });
  }

  renderFlag() {
    window.requestAnimationFrame(() => {
      let aspectRatioFlag = this.activeImgFlag.width / this.activeImgFlag.height;
      let imageWidth = this.flagHeight * aspectRatioFlag;
      let imageX = this.flagOffsetX + (this.flagWidth - imageWidth) / 2;
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(this.activeImgFlag, imageX, this.flagOffsetY, imageWidth, this.flagHeight);
    });
  }

  renderScore() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'left';
      const scoreSize = this.flagWidth / 20;
      this.ctx.font = `${scoreSize}px Arial`;
      this.ctx.fillStyle = this.colors.gallery;
      let currentTextX = this.flagOffsetX;
      let currentTextY = this.flagOffsetY - this.frameWidth / 2 - scoreSize;
      this.ctx.globalAlpha = 1;
      this.ctx.fillText(`SCORE: ${this.score}`, currentTextX, currentTextY);
    });
  }

  renderLive() {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 1;
      this.ctx.textAlign = 'left';
      const liveSize = this.flagWidth / 20;
      this.ctx.font = `${liveSize}px Arial`;
      this.ctx.fillStyle = this.colors.gallery;
      let currentTextX = this.flagOffsetX + this.flagWidth - liveSize * String(this.live).length / 2;
      let currentTextY = this.flagOffsetY - this.frameWidth / 2 - liveSize;
      this.ctx.fillText(`${this.live}`, currentTextX, currentTextY);
      // console.log(this.imgHuman);
      currentTextX -= liveSize * (String(this.live).length + 1.5) / 2;
      currentTextY -= liveSize * 0.6;
      this.ctx.drawImage(this.imgGame.human, currentTextX, currentTextY, liveSize, liveSize);
    });
  }

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

  addListeners() {
    this.checkClickAnswerCont = this.checkClickAnswer.bind(this);
    this.checkMoveAnswerCont = this.checkMoveAnswer.bind(this);
    this.canvas.addEventListener('click', this.checkClickAnswerCont);
    this.canvas.addEventListener('mousemove', this.checkMoveAnswerCont);
  }

  removeListeners() {
    this.canvas.removeEventListener('click', this.checkClickAnswerCont);
    this.canvas.removeEventListener('mousemove', this.checkMoveAnswerCont);
  }

  checkClickAnswer(e) {
    let zoom = this.calcZoom();
    for (let i = 0; i < this.levelGame; i++) {
      if (this.checkBorders(e, zoom, i)) {
        console.log('Variant', i, 'click');
        this.showResult(i);
      }
    }
  }

  checkMoveAnswer(e) {
    let zoom = this.calcZoom();
    for (let i = 0; i < this.levelGame; i++) {
      if (this.checkBorders(e, zoom, i)) {
        if (this.activeAnswer[i] !== 1) {
          e.target.style.cursor = 'url(../img/cursors/earth-pointer.png), pointer';
          this.renderAnswer(i, this.colors.osloGrayL, this.colors.spicyMixL, this.colors.white);
          console.log('Variant ', i, ' change');
          this.activeAnswer[i] = 1;
        }
      } else {
        if (this.activeAnswer[i] === 1) {
          e.target.style.cursor = 'url(../img/cursors/earth-cursor.png), default';
          this.renderAnswer(i, this.colors.osloGray, this.colors.spicyMix, this.colors.gallery);
          console.log('Variant ', i, ' return');
          this.activeAnswer[i] = 0;
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
    let borderLeft = e.pageX * k > this.boxOffsetX[number] - this.boxFrameSize / 2;
    let borderRight = e.pageX * k < this.boxOffsetX[number] + this.boxWidth + this.boxFrameSize / 2;
    let borderTop = e.pageY * k > this.boxOffsetY[number] - this.boxFrameSize / 2;
    let borderBottom = e.pageY * k < this.boxOffsetY[number] + this.boxHeight + this.boxFrameSize / 2;
    return borderLeft && borderRight && borderTop && borderBottom;
  }

  showResult(num) {
    this.removeListeners();
    let colorFrame;
    if (this.checkAnswer(num)) {
      colorFrame = this.colors.green;
    } else {
      colorFrame = this.colors.shiraz;
    }
    this.renderResultWhite(num, colorFrame);
  }

  checkAnswer(num) {
    return this.answerOptions[num] === this.activeFlag;
  }

  renderResultWhite(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      this.ctx.globalAlpha = transparent;
      this.ctx.lineWidth = this.boxFrameSize;
      this.ctx.strokeStyle = '#FFF';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeRect(this.boxOffsetX[num], this.boxOffsetY[num], this.boxWidth, this.boxHeight);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
        this.renderResultColor(num, color);
        this.renderArrow(num);
      }
    }, 100);
  }

  renderResultColor(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      this.ctx.globalAlpha = transparent;
      this.ctx.lineWidth = this.boxFrameSize;
      this.ctx.strokeStyle = color;
      this.ctx.lineJoin = 'round';
      this.ctx.strokeRect(this.boxOffsetX[num], this.boxOffsetY[num], this.boxWidth, this.boxHeight);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
      }
    }, 30);
  }

  reRenderResultColor(num, color) {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 1;
      this.ctx.lineWidth = this.boxFrameSize;
      this.ctx.strokeStyle = color;
      this.ctx.lineJoin = 'round';
      this.ctx.strokeRect(this.boxOffsetX[num], this.boxOffsetY[num], this.boxWidth, this.boxHeight);
    });
  }

  renderArrow(num) {
    if (this.checkAnswer(num)) {
      this.score++;
      this.renderArrowRight1(num);
    } else {
      this.live--;
      this.renderArrowWrong(num);
    }
  }

  renderArrowRight1(num) {
    // console.log('стартанули', num);
    let XStart = this.boxOffsetX[num] - this.boxHeight / 4 + this.boxWidth / 2;
    let XEnd = this.boxOffsetX[num] + this.boxWidth / 2;
    let XInterval = (XEnd - XStart) / 4;
    let XCurrent = XStart;
    let YStart = this.boxOffsetY[num] + this.boxHeight / 2;
    let YEnd = this.boxOffsetY[num] + this.boxHeight - this.boxHeight / 5;
    let YInterval = (YEnd - YStart) / 4;
    let YCurrent = YStart;
    this.ctx.strokeStyle = this.colors.green;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    if (this.currentRender[0] === 2) {
      window.requestAnimationFrame(() => {
        this.ctx.strokeStyle = this.colors.green;
        this.ctx.moveTo(XStart, YStart);
        this.ctx.lineTo(XEnd, YEnd);
        this.ctx.stroke();
      });
    } else {
      let timerArrow1 = setInterval(() => {
        // self.ctx.globalAlpha = 0.8;
        this.ctx.lineWidth = 8;
        this.ctx.moveTo(XCurrent, YCurrent);
        XCurrent = XCurrent + XInterval;
        YCurrent = YCurrent + YInterval;
        this.ctx.lineTo(XCurrent, YCurrent);
        this.ctx.stroke();
        if (YCurrent >= YEnd || XCurrent >= XEnd) {
          // console.log('закончили')
          this.renderArrowRight2(num);
          clearTimeout(timerArrow1);
        }
      }, 40);
    }
  }

  renderArrowRight2(num) {
    // console.log('стартанули 2', num);
    let XStart = this.boxOffsetX[num] + this.boxWidth / 2;
    let XEnd = this.boxOffsetX[num] + this.boxHeight / 3 + this.boxWidth / 2;
    let XInterval = (XEnd - XStart) / 4;
    let XCurrent = XStart;
    let YStart = this.boxOffsetY[num] + this.boxHeight - this.boxHeight / 5;
    let YEnd = this.boxOffsetY[num] + this.boxHeight / 4;
    let YInterval = (YEnd - YStart) / 4;
    let YCurrent = YStart;
    if (this.currentRender[0] === 2) {
      window.requestAnimationFrame(() => {
        this.ctx.strokeStyle = this.colors.green;
        this.ctx.moveTo(XStart, YStart);
        this.ctx.lineTo(XEnd, YEnd);
        this.ctx.stroke();
      });
    } else {
      let timerArrow2 = setInterval(() => {
        // self.game.ctx.beginPath();
        this.ctx.lineWidth = 8;
        this.ctx.moveTo(XCurrent, YCurrent);
        XCurrent = XCurrent + XInterval;
        YCurrent = YCurrent + YInterval;
        this.ctx.lineTo(XCurrent, YCurrent);
        this.ctx.stroke();
        if (YCurrent <= YEnd || XCurrent >= XEnd) {
          // console.log('закончили2')
          clearTimeout(timerArrow2);
          this.canvas.style.cursor = 'url(../img/cursors/earth-cursor.png), default';
          this.currentRender = [2, num, this.colors.green];
          this.continueGame();
        }
      }, 40);
    }
  }

  renderArrowWrong(num) {
    // console.log(num, 'стартанули');
    let XStart = this.boxOffsetX[num] + this.boxWidth / 2;
    let XEnd = [];
    XEnd[0] = XStart - this.boxHeight / 3;
    XEnd[1] = XStart + this.boxHeight / 3;
    let XInterval = (XEnd[1] - XStart) / 10;
    let XCurrent = [];
    XCurrent[0] = XCurrent[1] = XStart;
    let YStart = this.boxOffsetY[num] + this.boxHeight / 2;
    let YEnd = [];
    YEnd[0] = YStart - this.boxHeight / 3;
    YEnd[1] = YStart + this.boxHeight / 3;
    let YInterval = (YEnd[1] - YStart) / 10;
    let YCurrent = [];
    YCurrent[0] = YCurrent[1] = YStart;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    if (this.currentRender[0] === 1) {
      window.requestAnimationFrame(() => {
        this.ctx.strokeStyle = this.colors.shiraz;
        this.ctx.lineWidth = 7;
        this.ctx.moveTo(XStart, YStart);
        for (let i = 0; i <= 1; i++) {
          for (let j = 0; j <= 1; j++) {
            this.ctx.moveTo(XStart, YStart);
            this.ctx.lineTo(XEnd[i], YEnd[j]);
            this.ctx.stroke();
          }
        }
      });
    } else {
      let timerArrow3 = setInterval(() => {
        this.ctx.strokeStyle = this.colors.shiraz;
        this.ctx.lineWidth = 7;
        for (let i = 0; i <= 1; i++) {
          for (let j = 0; j <= 1; j++) {
            this.ctx.moveTo(XStart, YStart);
            this.ctx.lineTo(XCurrent[i], YCurrent[j]);
            this.ctx.stroke();
          }
        }
        XCurrent[0] = XCurrent[0] - XInterval;
        XCurrent[1] = XCurrent[1] + XInterval;
        YCurrent[0] = YCurrent[0] - YInterval;
        YCurrent[1] = YCurrent[1] + YInterval;
        // console.log(YCurrent[1], YEnd[1]);
        if (YCurrent[1] >= YEnd[1]) {
          clearTimeout(timerArrow3);
          this.canvas.style.cursor = 'url(../img/cursors/earth-cursor.png), default';
          this.currentRender = [1, num, this.colors.shiraz];
          this.continueGame();
        }
      }, 30);
    }
  }

  continueGame() {
    this.renderMessageContinue();
    this.checkContinueCont = this.checkContinue.bind(this);
    this.canvas.addEventListener('click', this.checkContinueCont);
  }

  renderMessageContinue() {
    window.requestAnimationFrame(() => {
      this.ctx.textAlign = 'center';
      const infoSize = this.flagWidth / 17;
      this.ctx.font = `${infoSize}px Arial`;
      this.ctx.fillStyle = this.colors.osloGray;
      let currentTextX = this.flagOffsetX + this.flagWidth / 2;
      let currentTextY = this.boxOffsetY[this.boxOffsetY.length - 1] + this.boxHeight + infoSize;
      this.ctx.fillText(`TAP or CLICK to CONTINUE...`, currentTextX, currentTextY);
    });
  }

  checkContinue() {
    this.canvas.removeEventListener('click', this.checkContinueCont);
    if (this.live > 0) {
      this.startNextRound();
    } else {
      setTimeout(() => {
        this.finishGame();
      }, 500);
    }
  }

  startNextRound() {
    this.startGame();
  }

  finishGame() {
    this.renderBackground();
    this.renderFrame();
    this.renderScore();
    this.renderLive();
    this.renderGameOver();
    this.renderFinishButtons();
  }

  renderGameOver() {
    window.requestAnimationFrame(() => {
      this.ctx.globalAlpha = 1;
      this.ctx.textAlign = 'center';
      const infoSize = this.flagWidth / 7;
      this.ctx.font = `${infoSize}px Arial`;
      this.ctx.fillStyle = this.colors.shiraz;
      let currentTextX = this.flagOffsetX + this.flagWidth / 2;
      let currentTextY = this.flagOffsetY + this.flagHeight / 2;
      this.ctx.fillText(`GAME OVER`, currentTextX, currentTextY);
    });
    this.currentRender = [3, 3, 3];
  }

  renderFinishButtons() {
    const menuWidth = (this.flagWidth - this.boxDist) / 2;
    let aspectRatioMenu = this.imgGame.button.width / this.imgGame.button.height;
    let menuHeight = menuWidth / aspectRatioMenu;
    let currentX = [];
    let currentY = this.boxOffsetY[0];
    currentX[0] = this.boxOffsetX[0];
    currentX[1] = currentX[0] + menuWidth + this.boxDist + this.frameWidth;
    this.ctx.globalAlpha = 0.75;
    for (let i = 0; i < 2; i++) {
      window.requestAnimationFrame(() => {
        this.renderFinishButton(this.imgGame.button, currentX[i], currentY, menuWidth, menuHeight);
      });
    }
    const textButton = ['PLAY NEW GAME', 'RETURN TO MENU'];
    this.ctx.globalAlpha = 1;
    for (let i = 0; i < 2; i++) {
      let currentTextX = currentX[i] + menuWidth / 2;
      let currentTextY = currentY + menuHeight / 1.8;
      const textSize = menuHeight / 3;
      window.requestAnimationFrame(() => {
        this.ctx.font = `${textSize}px Arial`;
        this.ctx.fillStyle = this.colors.gallery;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.renderButtonText(textButton[i], currentTextX, currentTextY);
      });
    }
  }

  renderFinishButton(image, offsetX, offsetY, width, height) {
    this.ctx.drawImage(image, offsetX, offsetY, width, height);
  }

  renderButtonText(text, currentX, currentY) {
    this.ctx.fillText(text, currentX, currentY);
  }
}