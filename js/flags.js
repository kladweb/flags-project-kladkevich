game.flags = {
  game: game,
  activeFlag: null,
  imagesFlags: {
    ad: 'Andorra',
    ae: 'United Arab Emirates',
    af: 'Afghanistan',
    ag: 'Antigua and Barbuda',
  },
  getRandomFlag() {
    let numberActiveFlag = Math.floor(Math.random() * (Object.keys(this.imagesFlags).length));
    this.activeFlag = Object.keys(this.imagesFlags)[numberActiveFlag];
  },

}