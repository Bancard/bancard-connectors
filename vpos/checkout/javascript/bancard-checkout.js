((function bancardCheckout(window) {
  var Settings = {
    IframeUrl: 'https://desa.infonet.com.py:8085/checkout/new?is_test_client=true&',
    DivId: void 0
  };

  var internalMethods = {
    redirect: function redirect(event) {
      var url = event.data.return_url;
      location.assign(url);
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.redirect);
    }
  };

  var BancardCheckout = function BancardCheckout() {};

  var DivDoesNotExist = function DivDoesNotExist(divId) {
    this.name = 'DivDoesNotExist';
    this.message = 'Div with id: ' + divId + ' could not be found.';
    this.stack = (new Error()).stack;
  };
  DivDoesNotExist.prototype = new Error();

  BancardCheckout.prototype.exceptions = {
    'DivDoesNotExist': DivDoesNotExist
  };

  BancardCheckout.prototype.init = function init(divId, processId) {
    var iframeUrl;
    var iframeContainer;
    var iframe;
    var lastIframeUrlChar;

    Settings.DivId = divId;

    iframeContainer = document.getElementById(divId);
    if (!iframeContainer) {
      throw new DivDoesNotExist(divId);
    }

    iframeUrl = Settings.IframeUrl;
    iframe = document.createElement('iframe');

    lastIframeUrlChar = iframeUrl.slice(-1);

    if (['&', '?'].indexOf(lastIframeUrlChar) > -1) {
      iframeUrl += 'process_id=' + processId;
    } else if (iframeUrl.indexOf('?') > -1) {
      iframeUrl += '&process_id=' + processId;
    } else {
      iframeUrl += '?process_id=' + processId;
    }

    iframe.src = iframeUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);

    internalMethods.setListener();
  };


  BancardCheckout.prototype.destroy = function destroy() {
    var iframeContainer = document.getElementById(Settings.DivId);

    window.removeEventListener('message', internalMethods.redirect);

    if (iframeContainer) {
      while (iframeContainer.firstChild) {
        iframeContainer.removeChild(iframeContainer.firstChild);
      }
    }

    Settings.DivId = void 0;
  };

  if (typeof (window.BancardCheckout) === 'undefined') {
    window.BancardCheckout = new BancardCheckout();
  }
})(window));
