import {MainMenu} from './MainMenu.js';
import {Game} from './Game.js';
import {About} from './About.js';

export class Spa {
  constructor() {
    this.SPAStateH = null; //текущее состояние приложения
    this.main = null;
    // this.tryBack = false;
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
        self.startAboutPage();
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
    if (this.game) {
      this.game.removeListeners();
      window.removeEventListener('resize', this.game.reRunGameCont);
    }
    if (this.about) {
      this.about.canvas.removeEventListener('click', this.about.checkBackCont);
      window.addEventListener('resize', this.about.reRunAboutCont);
    }
    if (!this.main) {
      this.main = new MainMenu(this);
    }
    if (this.game) {
      window.removeEventListener('beforeunload', this.warnUser);
      window.removeEventListener('popstate', this.askToBack);
    }
    this.main.initMenu();
  }

  startGamePage() {
    if (this.main) {
      this.main.removeListeners();
    }
    if (!this.game) {
      this.game = new Game(this);
      console.log('NEW GAME');
      this.game.initGame();
    } else {
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
    if (!self.game.goBack) {
      e.returnValue = 'You have made changes. They will be lost if you continue.';
      return 'You have made changes. They will be lost if you continue.';
    } else {
      e.returnValue = null;
    }
  }

  askToBack(e) {
    if (!self.game.goBack) {
      let ask = confirm('You have made changes. Do you really want to go back?');
      if (ask) {
        self.game.removeListeners();
        self.game.canvas.removeEventListener('click', self.game.checkContinueCont);
        window.removeEventListener('popstate', self.askToBack);
        console.log(555);
      } else {
        window.removeEventListener('hashchange', self.switchToStateFromURLHash);
        window.removeEventListener('popstate', self.askToBack);
        self.switchToGamePage();
        setTimeout(() => {
          window.addEventListener('hashchange', self.switchToStateFromURLHash);
          window.addEventListener('popstate', self.askToBack);
        }, 200);
      }
    }
  }

  startAboutPage() {
    if (this.game) {
      this.game.removeListeners();
    }
    if (this.main) {
      this.main.removeListeners();
      window.removeEventListener('resize', this.main.reRunMenuCont);
    }
    if (!this.about) {
      this.about = new About(this);
    }
    this.about.initAbout();
  }
}