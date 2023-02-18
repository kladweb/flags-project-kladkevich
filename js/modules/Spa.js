import {MainMenu} from './MainMenu.js';
import {Game} from './Game.js';
import {Score} from './Score.js';
import {About} from './About.js';
import {SettingsPage} from "./SettingsPage.js";

export class Spa {
  constructor() {
    this.SPAStateH = null; //текущее состояние приложения
    this.main = null;
    this.audioF = {
      melody: null,
      good: null,
      wrong: null,
      click: null
    }
    this.storageName = 'settFlagGame';
    // this.settings = {
    //   'music': 1,
    //   'sounds': 1
    // };
    // this.settings[0] = 1; //музыка включена
    // this.settings[1] = 1; //звуки включены
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
        self.startHiScorePage()
        console.log('HiScorePage');
        break;
      case 'settings':
        self.startSettingsPage();
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
      this.game.removeFinishListeners();
      window.removeEventListener('resize', this.game.reRunGameCont);
    }
    if (this.score) {
      window.removeEventListener('resize', this.score.reRunAScoreCont);
    }
    if (this.pageSet) {
      this.pageSet.removeListeners();
    }
    if (this.about) {
      this.about.canvas.removeEventListener('click', this.about.checkBackCont);
      window.removeEventListener('resize', this.about.reRunAboutCont);
    }
    if (this.game) {
      window.removeEventListener('beforeunload', this.warnUser);
      window.removeEventListener('popstate', this.askToBack);
    }
    if (!this.main) {
      this.main = new MainMenu(this);
    }
    this.main.initMenu();
  }

  startGamePage() {
    if (!this.score) {
      this.score = new Score(this);
      this.score.start();
    }
    this.score.loadData();
    if (this.main) {
      this.main.removeListeners();
    }
    if (this.pageSet) {
      this.pageSet.removeListeners();
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

  startHiScorePage() {
    if (this.main) {
      this.main.removeListeners();
      window.removeEventListener('resize', this.main.reRunMenuCont);
    }
    if (!this.score) {
      this.score = new Score(this);
    }

    this.score.loadData().then(() => {
      this.score.initScore();
    });
  }

  startSettingsPage() {
    if (this.main) {
      this.main.removeListeners();
      window.removeEventListener('resize', this.main.reRunMenuCont);
    }
    this.pageSet.initPageSet();
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

  checkResult() {
    if (!this.score) {
      this.score = new Score(this);
    }

    this.score.loadData()
    .then(() => {
      this.checkScore();
    });
  }

  checkScore() {
    if (this.game.score > this.score.scList[4].score) {
      let currentName = prompt(
        'Congratulations!\n' +
        'You are in the high score table!\n' +
        'Enter your first and/or last name:');
      if (currentName) {
        currentName = this.nameProcessing(currentName);
        let now = new Date;
        let nowDate = now.getDate().toString();
        nowDate = (nowDate.length === 2) ? (nowDate) : (`0${nowDate}`);
        let nowMonth = (now.getMonth() + 1).toString();
        nowMonth = (nowMonth.length === 2) ? (nowMonth) : (`0${nowMonth}`);
        let nowYear = now.getFullYear().toString();
        let currentDate = `${nowDate}.${nowMonth}.${nowYear}`;
        this.score.scList[4] = {
          'user': currentName,
          'score': this.game.score,
          'date': currentDate
        }
      }
      this.score.scList.sort((a, b) => {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
      });
      this.score.saveData();
    }
  }

  nameProcessing(name) {
    name = name.trim();
    name = this.escapeHTML(name);
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    return name;
  }

  escapeHTML(text) {
    if (!text)
      return text;
    text = text.toString()
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
    return text;
  }

  initApp() {
    this.pageSet = new SettingsPage(this);
    this.pageSet.init();
    this.pageSet.addListeners();
    console.log('слежка_шаг1');
    this.loadSettings();
    this.loadAudio();
  }

  // preloadAudioFiles(callback) {
  //   console.log('слежка_шаг2');
  //   let loaded = 0;
  //   let required = Object.keys(this.audioF).length;
  //   console.log(required);
  //   const onAssetLoad = () => {
  //     ++loaded;
  //     console.log(loaded);
  //     if (loaded >= required) {
  //       callback();
  //     }
  //   };
  //   this.loadAudio();
  // }

  loadAudio() {
    console.log('слежка_шаг3');
    for (let key in this.audioF) {
      this.audioF[key] = new Audio(`../../sounds/${key}.mp3`);
    }
    this.audioF.melody.volume = 0.5;
    this.audioF.melody.loop = true;
    document.addEventListener('click', () => {
      console.log('Опачки ! * !');
      this.playMelody();
    });
  }

  // loadAudio(onAssetLoadCallback) {
  //   console.log('слежка_шаг3');
  //   for (let key in this.audioF) {
  //     this.audioF[key] = new Audio(`../../sounds/${key}.mp3`);
  //     // this.audioF[key].src = '../../sounds/' + key + '.mp3';
  //     this.audioF[key].addEventListener('load', onAssetLoadCallback);
  //     console.log(this.audioF);
  //     // this.audioF.melody.play();
  //   }
  // }

  loadSettings() {
    console.log('слежка_шаг5');
    let storageLocalString = window.localStorage.getItem(this.storageName);
    if (storageLocalString) {
      this.pageSet.settings = JSON.parse(storageLocalString);
      console.log('загрузили', JSON.parse(storageLocalString));
    }
  }

  saveSettings() {
    window.localStorage.setItem(this.storageName, JSON.stringify(this.pageSet.settings));
    console.log('сохранили', JSON.stringify(this.pageSet.settings));
  }

  playMelody() {
    if (this.pageSet.settings[0] === 1) {
      this.audioF.melody.play();
    }
    if (this.pageSet.settings[0] === 0) {
      this.audioF.melody.pause();
    }
  }

  playClick() {
    if (this.pageSet.settings[1] === 1) {
      this.audioF.click.play();
    }
  }

  playWrong() {
    if (this.pageSet.settings[1] === 1) {
      this.audioF.wrong.play();
    }
  }

  playGood() {
    if (this.pageSet.settings[1] === 1) {
      this.audioF.good.play();
    }
  }
}