'use strict';

game.answers = {
  game: game,
  width: 0, //ширина рамки с вариантом ответа (зависит от ширины картинки флага)
  height: 60, //высота рамки с вариантом ответа
  dist: 30, //расстояние между рамками с ответами
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
    this.width = (this.game.flags.width + this.game.flags.frameWidth) / 2 - this.frameWidth - this.dist / 2;
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
      self.game.ctx.lineJoin = 'round';
      self.game.ctx.lineWidth = self.frameWidth;
      self.game.ctx.strokeStyle = colorFrame;
      self.game.ctx.fillStyle = colorFill;
      self.game.ctx.fillRect(self.offsetX[num], self.offsetY[num], self.width, self.height);
      self.game.ctx.strokeRect(self.offsetX[num], self.offsetY[num], self.width, self.height);
    });
    window.requestAnimationFrame(() => {
      self.game.ctx.fillStyle = colorText;
      let currentTextX = self.offsetX[num] + self.width / 2;
      let currentTextY = self.offsetY[num] + self.height / 2;
      self.game.ctx.fillText(self.game.flags.imagesFlags[self.answerOptions[num]], currentTextX, currentTextY);
    });
  },
  checkClickAnswer(e) {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = self.game.canvas.getBoundingClientRect();
    let zoom = oldCanvas.width / currentSizes.width;
    for (let i = 0; i < self.levelGame; i++) {
      if (self.checkBorders(e, zoom, i)) {
        console.log('Variant', i, 'click');
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
          console.log('Variant ', i, ' change');
          self.activeAnswer[i] = 1;
        }
      } else {
        if (self.activeAnswer[i] === 1) {
          e.target.style.cursor = 'default';
          self.renderAnswer(i, self.game.colors.osloGray, self.game.colors.spicyMix, self.game.colors.gallery);
          console.log('Variant ', i, ' return');
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
    console.log(num);
    console.log(this.answerOptions[num]);
    console.log(this.game.flags.activeFlag);
    return this.answerOptions[num] === this.game.flags.activeFlag;
  },
  renderResultWhite(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      self.game.ctx.globalAlpha = transparent;
      self.game.ctx.lineWidth = self.frameWidth;
      self.game.ctx.strokeStyle = '#FFF';
      self.game.ctx.lineJoin = 'round';
      self.game.ctx.strokeRect(self.offsetX[num], self.offsetY[num], self.width, self.height);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
        self.renderResultColor(num, color);
      }
    }, 100);
  },
  renderResultColor(num, color) {
    let transparent = 0;
    let timerId = setInterval(() => {
      self.game.ctx.lineWidth = self.frameWidth;
      self.game.ctx.strokeStyle = color;
      self.game.ctx.lineJoin = 'round';
      self.game.ctx.strokeRect(self.offsetX[num], self.offsetY[num], self.width, self.height);
      transparent += 0.1;
      if (transparent >= 1) {
        clearTimeout(timerId);
      }
    }, 20);
  }
}