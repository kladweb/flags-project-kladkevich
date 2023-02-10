import {MainMenu} from './MainMenu.js';
import {Game} from './Game.js';

export class Spa {
  constructor() {
    this.SPAStateH = null; //текущее состояние приложения
    this.mainMenu = null;
    this.tryBack = false;
    window.addEventListener('hashchange', this.switchToStateFromURLHash);
    self = this;
  }

  switchToStateFromURLHash() {
    const URLHash = window.location.hash;
    const stateJSON = decodeURIComponent(URLHash.substring(1));
    if (stateJSON !== '') {
      this.SPAStateH = JSON.parse(stateJSON);
    } else {
      this.SPAStateH = {pageName: 'main'};
    }
    switch (this.SPAStateH.pageName) {
      case 'main':
        self.startMainMenu();
        break;
      case 'game':
        self.startGamePage();
        break;
      case 'hiScore':
        console.log('HiScorePage');
        break;
      case 'settings':
        console.log('Settings');
        break;
      case 'about':
        console.log('About');
        break;
    }
  }

  switchToState(newStateH) {
    location.hash = encodeURIComponent(JSON.stringify(newStateH));
  }

  switchToMainPage() {
    this.switchToState({pageName: 'main'});
  }

  switchToGamePage() {
    this.switchToState({pageName: 'game'});
  }

  switchToHiScorePage() {
    this.switchToState({pageName: 'hiScore'});
  }

  switchSettingsPage() {
    this.switchToState({pageName: 'settings'});
  }

  switchAboutPage() {
    this.switchToState({pageName: 'about'});
  }

  startMainMenu() {
    if (!this.main) {
      this.main = new MainMenu(this);
    }
    window.removeEventListener('beforeunload', this.warnUser);
    this.main.initMenu();
  }

  startGamePage() {
    if (!this.game) {
      this.game = new Game(this);
    }
    if (this.tryBack !== true) {
      this.game.initGame();
    }
    window.addEventListener('beforeunload', this.warnUser);
    window.addEventListener('popstate', this.askToBack);

    // window.onbeforeunload = function () {
    //   return "You have made changes. They will be lost if you continue.";
    // }
    // self.allowPrompt = true;
  }

  warnUser(e) {
    if (self.game.allowPrompt) {
      e.returnValue = 'You have made changes. They will be lost if you continue.';
      return 'You have made changes. They will be lost if you continue.';
    }
  }

  askToBack(e) {
    let ask = confirm('You have made changes. Do you really want to go back?');
    console.log(ask);
    window.removeEventListener('popstate', self.askToBack);
    if (!ask) {
      self.tryBack = true;
      self.switchToGamePage();
    } else {
      self.tryBack = false;
    }
  }


}