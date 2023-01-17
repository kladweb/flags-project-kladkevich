'use strict';

game.answers = {
  game: game,
  width: 0, //ширина рамки с вариантом ответа (зависит от ширины картинки флага)
  height: 60, //высота рамки с вариантом ответа
  dist: 30, //расстояние между рамками с ответами
  frameWidth: 6, //толщина рамки вокруг варианта ответа
  offsetX: [],
  offsetY: [],
  answerOptions: [],
  levelGame: 4,  //количество вариантов ответов
  activeAnswer: null,  //вариант ответа, на который наведена мышь
  getRandomAnswers() {
    this.answerOptions[0] = (this.game.flags.imagesFlags[this.game.flags.activeFlag]);
    //из строки выше у нас есть массив с одним правильным ответом. Дополним этот массив другими рандомными
    // вариантами ответов:
    for (let i = 1; i < this.levelGame; i++) {
      let randomNumberFlag = Math.floor(Math.random() * (Object.keys(this.game.flags.imagesFlags).length));
      let randomAnswer = Object.keys(this.game.flags.imagesFlags)[randomNumberFlag];
      if (this.answerOptions.indexOf(this.game.flags.imagesFlags[randomAnswer]) === -1) {
        this.answerOptions[i] = (this.game.flags.imagesFlags[randomAnswer]);
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
    this.game.ctx.lineJoin = 'round';
    window.requestAnimationFrame(() => {
      this.game.ctx.lineWidth = this.frameWidth;
      this.game.ctx.strokeStyle = colorFrame;
      this.game.ctx.fillStyle = colorFill;
      this.game.ctx.strokeRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
      this.game.ctx.fillRect(this.offsetX[num], this.offsetY[num], this.width, this.height);
    });
    window.requestAnimationFrame(() => {
      this.game.ctx.fillStyle = colorText;
      let currentTextX = this.offsetX[num] + this.width / 2;
      let currentTextY = this.offsetY[num] + this.height / 2;
      this.game.ctx.fillText(this.answerOptions[num], currentTextX, currentTextY);
      console.log(this.answerOptions[num]);
    });
  },

  // renderAnswers() {
  //   this.game.ctx.save();
  //   this.game.ctx.lineWidth = this.frameWidth;
  //   this.game.ctx.strokeStyle = this.game.colors.osloGray;
  //   this.game.ctx.fillStyle = this.game.colors.spicyMix;
  //   window.requestAnimationFrame(() => {
  //     for (let i = 0; i < this.levelGame; i++) {
  //       this.game.ctx.strokeRect(this.offsetX[i], this.offsetY[i], this.width, this.height);
  //       this.game.ctx.fillRect(this.offsetX[i], this.offsetY[i], this.width, this.height);
  //     }
  //   });
  //   window.requestAnimationFrame(() => {
  //     this.game.ctx.fillStyle = this.game.colors.gallery;
  //     for (let i = 0; i < this.levelGame; i++) {
  //       let currentTextX = this.offsetX[i] + this.width / 2;
  //       let currentTextY = this.offsetY[i] + this.height / 2;
  //       this.game.ctx.fillText(this.answerOptions[i], currentTextX, currentTextY);
  //     }
  //     this.game.ctx.restore();
  //   });
  // },
  checkClickAnswer(e) {
    let oldCanvas = document.getElementById('cva');
    let currentSizes = self.game.canvas.getBoundingClientRect();
    let zoom = oldCanvas.width / currentSizes.width;
    if (self.checkBorders(e, zoom, 0)) {
      console.log('Variant1 click');
    }
    if (self.checkBorders(e, zoom, 1)) {
      console.log('Variant2 click');
    }
    if (self.checkBorders(e, zoom, 2)) {
      console.log('Variant3 click');
    }
    if (self.checkBorders(e, zoom, 3)) {
      console.log('Variant4 click');
    }
  },
  checkMoveAnswer(e) {
    // let numberHover = null;
    // let checkUnHover = 0;
    let oldCanvas = document.getElementById('cva');
    let currentSizes = self.game.canvas.getBoundingClientRect();
    let zoom = oldCanvas.width / currentSizes.width;
    for (let i = 0; i < self.levelGame; i++) {
      if (self.checkBorders(e, zoom, i)) {
        if (this.activeAnswer !== i) {
          console.log('Variant ', i, ' move');
          this.activeAnswer = i;
          e.target.style.cursor = 'pointer';
        }
      } else {
        if (this.activeAnswer === i) {
          e.target.style.cursor = 'default';
          this.activeAnswer = null;
        }
      }
    }
    // if (self.checkBorders(e, zoom, 0)) {
    //   if (this.activeAnswer !== 0) {
    //     console.log('Variant1 move');
    //     this.activeAnswer = 0;
    //   }
    // }
    // if (self.checkBorders(e, zoom, 1)) {
    //   console.log('Variant2 move');
    // }
    // if (self.checkBorders(e, zoom, 2)) {
    //   console.log('Variant3 move');
    // }
    // if (self.checkBorders(e, zoom, 3)) {
    //   console.log('Variant4 move');
    // }
  },
  checkBorders(e, k, number) {
    let borderLeft = e.pageX * k > self.offsetX[number] - self.frameWidth / 2;
    let borderRight = e.pageX * k < self.offsetX[number] + self.width + self.frameWidth / 2;
    let borderTop = e.pageY * k > self.offsetY[number] - self.frameWidth / 2;
    let borderBottom = e.pageY * k < self.offsetY[number] + self.height + self.frameWidth / 2;
    return borderLeft && borderRight && borderTop && borderBottom;
  }
}