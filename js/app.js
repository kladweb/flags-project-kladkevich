import {Spa} from './modules/Spa.js';

class App {
  static init() {
    const spa = new Spa();
    spa.switchToStateFromURLHash();
    // spa.switchToMainPage();
  }
}

App.init();