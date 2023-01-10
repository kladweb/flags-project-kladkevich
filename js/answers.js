'use strict';

game.answers = {
  game: game,
  answerOptions: [],
  getRandomAnswers() {
    this.answerOptions = [];
    this.answerOptions.push(this.game.flags.imagesFlags[this.game.flags.activeFlag]);
    //из строки выше у нас есть массив с одним правильным ответом. Дополним этот массив другими рандомными
    // вариантами ответов:
    for (let i = 0; i < 3; i++) {
      let randomNumberFlag = Math.floor(Math.random() * (Object.keys(this.game.flags.imagesFlags).length));
      let randomAnswer = Object.keys(this.game.flags.imagesFlags)[randomNumberFlag];
      if (this.answerOptions.indexOf(this.game.flags.imagesFlags[randomAnswer]) === -1) {
        this.answerOptions.push(this.game.flags.imagesFlags[randomAnswer]);
      } else {
        i--;
      }
    }
    //перемешаем этот массив, чтобы правильный вариант ответа не всегда был на первом месте:
    for (let i = this.answerOptions.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.answerOptions[i], this.answerOptions[j]] = [this.answerOptions[j], this.answerOptions[i]];
    }
    // console.log(this.answerOptions);
  },

}
