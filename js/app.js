import {Spa} from './modules/Spa.js';

class App {
  static init() {
    const spa = new Spa();
    spa.initApp();
    spa.switchToStateFromURLHash();
  }
}

App.init();