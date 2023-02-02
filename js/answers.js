'use strict';

game.answers = {
  game: game,
  width: 0, //ширина рамки с вариантом ответа (зависит от ширины картинки флага)
  height: 0, //высота рамки с вариантом ответа
  dist: 0, //расстояние между рамками с ответами
  frameWidth: 3.5, //толщина рамки вокруг варианта ответа
  offsetX: [],
  offsetY: [],
  levelGame: 4,  //количество вариантов ответов
  answerOptions: [], //массив с вариантами ответов, один из которых верный
  activeAnswer: [],  //массив, определяющий положение курсора относительно рамок с ответами. Например [0,0,0,0] -
  // курсор не наведен ни на одну рамку; [0,1,0,0] - курсор на втором варианте ответа.

  getRandomAnswers() {
    this.activeAnswer[0] = 0;
    this.answerOptions[0] = (this.game.flags.activeFlag);
    //из строки выше у нас есть массив с одним правильным ответом. Дополним этот массив другими рандомными
    // вариантами ответов:
    for (let i = 1; i < this.levelGame; i++) {
      let randomNumberFlag = Math.floor(Math.random() * (Object.keys(this.game.flags.imagesFlags).length));
      let randomAnswer = Object.keys(this.game.flags.imagesFlags)[randomNumberFlag];
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
  },
  createAnswers() {
    this.dist = this.game.flags.width / 25;
    this.width = (this.game.flags.width + this.game.flags.frameWidth) / 2 - this.frameWidth - this.dist / 2;
    this.height = this.width / 5;
    this.offsetX[0] = this.game.flags.offsetX - (this.game.flags.frameWidth - this.frameWidth) / 2;
    this.offsetY[0] = this.game.flags.offsetY + this.game.flags.height + this.game.flags.frameWidth / 2 + this.dist * 2;
    this.offsetX[1] = this.offsetX[0] + this.width + this.frameWidth + this.dist;
    this.offsetY[1] = this.offsetY[0];
    this.offsetX[2] = this.offsetX[0];
    this.offsetY[2] = this.offsetY[0] + this.height + this.frameWidth + this.dist;
    this.offsetX[3] = this.offsetX[1];
    this.offsetY[3] = this.offsetY[2];
    this.game.ctx.textAlign = 'center';
    this.game.ctx.textBaseline = 'middle';
    self = this;
  },
  renderAnswers() {
    for (let i = 0; i < this.levelGame; i++) {
      this.renderAnswer(i, this.game.colors.osloGray, this.game.colors.spicyMix, this.game.colors.gallery);
    }
  },
  renderAnswer(num, colorFrame, colorFill, colorText) {
    window.requestAnimationFrame(() => {
      this.game.ctx.globalAlpha = 1;
      this.game.ctx.lineJoin = 'round';
      this.game.ctx.lineWidth = self.frameWidth;
      this.game.ctx.strokeStyle = colorFrame;
      this.game.ctx.fillStyle = colorFill;
      this.game.ctx.fillRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
      this.game.ctx.strokeRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
    });
    window.requestAnimationFrame(() => {
      this.game.ctx.fillStyle = colorText;
      this.game.ctx.textAlign = 'center';
      const answerSize = this.width / 15;
      this.game.ctx.font = `${answerSize}px Arial`;
      let currentTextX = this.offsetX[num] + this.width / 2;
      let currentTextY = this.offsetY[num] + this.height / 2;
      this.game.ctx.fillText(this.game.flags.imagesFlags[this.answerOptions[num]], currentTextX, currentTextY);
    });
  },
  checkClickAnswer(e) {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = self.game.canvas.getBoundingClientRect();
    let zoom = oldCanvas.width / currentSizes.width;
    for (let i = 0; i < self.levelGame; i++) {
      if (self.checkBorders(e, zoom, i)) {
        // console.log('Variant', i, 'click');
        self.showResult(i);
      }
    }
  },
  checkMoveAnswer(e) {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = self.game.canvas.getBoundingClientRect();
    let zoom = oldCanvas.width / currentSizes.width;
    for (let i = 0; i < self.levelGame; i++) {
      if (self.checkBorders(e, zoom, i)) {
        if (self.activeAnswer[i] !== 1) {
          e.target.style.cursor = 'pointer';
          self.renderAnswer(i, self.game.colors.osloGrayL, self.game.colors.spicyMixL, self.game.colors.white);
          // console.log('Variant ', i, ' change');
          self.activeAnswer[i] = 1;
        }
      } else {
        if (self.activeAnswer[i] === 1) {
          e.target.style.cursor = 'default';
          self.renderAnswer(i, self.game.colors.osloGray, self.game.colors.spicyMix, self.game.colors.gallery);
          // console.log('Variant ', i, ' return');
          self.activeAnswer[i] = 0;
        }
      }
    }
  },
  checkBorders(e, k, number) {
    let borderLeft = e.pageX * k > self.offsetX[number] - self.frameWidth / 2;
    let borderRight = e.pageX * k < self.offsetX[number] + self.width + self.frameWidth / 2;
    let borderTop = e.pageY * k > self.offsetY[number] - self.frameWidth / 2;
    let borderBottom = e.pageY * k < self.offsetY[number] + self.height + self.frameWidth / 2;
    return borderLeft && borderRight && borderTop && borderBottom;
  },
  showResult(num) {
    this.game.removeListeners();
    let colorFrame;
    if (this.checkAnswer(num)) {
      colorFrame = self.game.colors.green;
    } else {
      colorFrame = self.game.colors.shiraz;
    }
    this.renderResultWhite(num, colorFrame);
  },
  checkAnswer(num) {
    // console.log(num);
    // console.log(this.answerOptions[num]);
    // console.log(this.game.flags.activeFlag);
    return this.answerOptions[num] === this.game.flags.activeFlag;
  },
  renderResultWhite(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      this.game.ctx.globalAlpha = transparent;
      this.game.ctx.lineWidth = this.frameWidth;
      this.game.ctx.strokeStyle = '#FFF';
      this.game.ctx.lineJoin = 'round';
      this.game.ctx.strokeRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
        this.renderResultColor(num, color);
        this.renderArrow(num);
      }
    }, 100);
  },
  renderResultColor(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      this.game.ctx.lineWidth = this.frameWidth;
      this.game.ctx.strokeStyle = color;
      this.game.ctx.lineJoin = 'round';
      this.game.ctx.strokeRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
      }
    }, 20);
  },
  renderArrow(num) {
    if (this.checkAnswer(num)) {
      this.game.score++;
      this.renderArrowRight1(num);
    } else {
      this.game.live--;
      this.renderArrowWrong(num);
    }
  },
  renderArrowRight1(num) {
    // console.log('стартанули', num);
    let XStart = this.offsetX[num] - this.height / 4 + this.width / 2;
    let XEnd = this.offsetX[num] + this.width / 2;
    let XInterval = (XEnd - XStart) / 4;
    let XCurrent = XStart;
    let YStart = this.offsetY[num] + this.height / 2;
    let YEnd = this.offsetY[num] + this.height - this.height / 5;
    let YInterval = (YEnd - YStart) / 4;
    let YCurrent = YStart;
    this.game.ctx.strokeStyle = self.game.colors.green;
    this.game.ctx.lineJoin = 'round';
    this.game.ctx.lineCap = 'round';
    this.game.ctx.beginPath();
    let timerArrow1 = setInterval(() => {
      // self.game.ctx.globalAlpha = 0.8;
      this.game.ctx.lineWidth = 8;
      this.game.ctx.moveTo(XCurrent, YCurrent);
      XCurrent = XCurrent + XInterval;
      YCurrent = YCurrent + YInterval;
      this.game.ctx.lineTo(XCurrent, YCurrent);
      this.game.ctx.stroke();
      if (YCurrent >= YEnd || XCurrent >= XEnd) {
        // console.log('закончили')
        this.renderArrowRight2(num);
        clearTimeout(timerArrow1);
      }
    }, 40);
  },
  renderArrowRight2(num) {
    // console.log('стартанули 2', num);
    let XStart = this.offsetX[num] + this.width / 2;
    let XEnd = this.offsetX[num] + this.height / 3 + this.width / 2;
    let XInterval = (XEnd - XStart) / 4;
    let XCurrent = XStart;
    let YStart = this.offsetY[num] + this.height - this.height / 5;
    let YEnd = this.offsetY[num] + this.height / 4;
    let YInterval = (YEnd - YStart) / 4;
    let YCurrent = YStart;
    let timerArrow2 = setInterval(() => {

      // self.game.ctx.beginPath();
      this.game.ctx.lineWidth = 8;
      this.game.ctx.moveTo(XCurrent, YCurrent);
      XCurrent = XCurrent + XInterval;
      YCurrent = YCurrent + YInterval;
      this.game.ctx.lineTo(XCurrent, YCurrent);
      this.game.ctx.stroke();
      if (YCurrent <= YEnd || XCurrent >= XEnd) {
        // console.log('закончили2')
        clearTimeout(timerArrow2);
        this.game.continueGame();
      }
    }, 40);
  },
  renderArrowWrong(num) {
    // console.log(num, 'стартанули');
    let XStart = self.offsetX[num] + self.width / 2;
    let XEnd = [];
    XEnd[0] = XStart - self.height / 3;
    XEnd[1] = XStart + self.height / 3;
    let XInterval = (XEnd[1] - XStart) / 10;
    let XCurrent = [];
    XCurrent[0] = XCurrent[1] = XStart;
    let YStart = self.offsetY[num] + self.height / 2;
    let YEnd = [];
    YEnd[0] = YStart - self.height / 3;
    YEnd[1] = YStart + self.height / 3;
    let YInterval = (YEnd[1] - YStart) / 10;
    let YCurrent = [];
    YCurrent[0] = YCurrent[1] = YStart;
    self.game.ctx.strokeStyle = self.game.colors.shiraz;
    self.game.ctx.lineJoin = 'round';
    self.game.ctx.lineCap = 'round';
    self.game.ctx.beginPath();
    let timerArrow3 = setInterval(() => {
      self.game.ctx.lineWidth = 7;
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          self.game.ctx.moveTo(XStart, YStart);
          self.game.ctx.lineTo(XCurrent[i], YCurrent[j]);
          self.game.ctx.stroke();
        }
      }
      XCurrent[0] = XCurrent[0] - XInterval;
      XCurrent[1] = XCurrent[1] + XInterval;
      YCurrent[0] = YCurrent[0] - YInterval;
      YCurrent[1] = YCurrent[1] + YInterval;
      // console.log(YCurrent[1], YEnd[1]);
      if (YCurrent[1] >= YEnd[1]) {
        // console.log('стояночка');
        clearTimeout(timerArrow3);
        this.game.continueGame();
      }
    }, 30);
  }
}