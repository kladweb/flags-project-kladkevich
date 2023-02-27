export class Multimedia {
  constructor() {
    this.audioF = {
      melody: null,
      good: null,
      wrong: null,
      click: null
    }
    this.storageName = 'settFlagGame';
    this.settingsMedia = [1, 1, 1, 1];  //загружаются и сохраняются в localStorage
    // this.settingsMedia[0] = 1; //показывать правильный ответ
    // this.settingsMedia[1] = 1; //музыка включена  0 - музыка выключена (значение параметра);
    // this.settingsMedia[2] = 1; //звуки включены
    // this.settingsMedia[3] = 1; //вибрация включена
    // this.isMobile;  //является ли устройство мобильным (для включения возможностей вибро);
  }

  set setMedia(value) {
    // value - это массив [номер кнопки, значение параметра]
    this.settingsMedia[value[0]] = value[1];
    this.saveSettings();
  }

  initMedia() {
    this.loadSettings();
    this.loadAudio();
  }

  loadSettings() {
    this.isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
    let storageLocalString = window.localStorage.getItem(this.storageName);
    if (storageLocalString) {
      this.settingsMedia = JSON.parse(storageLocalString);
    }
    if (this.settingsMedia.length !== 4) {
      this.settingsMedia = [1, 1, 1, 1];
    }
    if (!this.isMobile) {
      this.setMedia = [3, 0];
    }
  }

  saveSettings() {
    window.localStorage.setItem(this.storageName, JSON.stringify(this.settingsMedia));
  }

  loadAudio() {
    for (let key in this.audioF) {
      this.audioF[key] = new Audio(`/sounds/${key}.mp3`);
    }
    this.audioF.melody.volume = 0.5;
    this.audioF.melody.loop = true;
    document.addEventListener('click', () => {
      this.playMelody();
    });
  }

  playMelody() {
    if (this.settingsMedia[1] === 1) {
      this.audioF.melody.play();
    }
    if (this.settingsMedia[1] === 0) {
      this.audioF.melody.pause();
    }
  }

  playClick(n = 0) {
    if (this.settingsMedia[2] === 1 && n !== 3) {
      this.audioF.click.play();
    }
    if (this.settingsMedia[3] === 1 && n !== 2) {
      window.navigator.vibrate(10);
    }
  }

  playWrong() {
    if (this.settingsMedia[2] === 1) {
      this.audioF.wrong.play();
    }
    if (this.settingsMedia[3] === 1) {
      window.navigator.vibrate([10, 1000, 150]);
    }
  }

  playGood() {
    if (this.settingsMedia[2] === 1) {
      this.audioF.good.play();
    }
    if (this.settingsMedia[3] === 1) {
      window.navigator.vibrate([10, 1000, 10, 50, 10, 50, 10]);
    }
  }
}