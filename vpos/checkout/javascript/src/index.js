import Bancard from './bancard-checkout';

((function bancard(window) {
  if (typeof (window.Bancard) === 'undefined') {
    window.Bancard = new Bancard(); // eslint-disable-line no-param-reassign
  }
})(window));
