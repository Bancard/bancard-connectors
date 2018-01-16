((function bancard(window) {
  var BancardUrl = 'https://desa.infonet.com.py:8085';

  var Settings = {
    CheckoutIframeUrl: BancardUrl + '/checkout/new',
    NewCardIframeUrl: BancardUrl + '/checkout/register_card/new',
    DivId: null,
    Handler: 'default'
  };

  var internalMethods = {
    redirect: function redirect(data) {
      var url = data.return_url;
      var status = data.message;

      url = internalMethods.addParamToUrl(url, 'status', status);
      location.assign(url);
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.responseHandler);
    },

    responseHandler: function responseHandler(event) {
      if (event.origin !== BancardUrl) {
        return;
      }

      if (Settings.Handler === 'default') {
        internalMethods.redirect(event.data);
      } else {
        Settings.Handler(event.data);
      }
    },

    addParamToUrl: function addParamToUrl(url, param, value) {
      var lastUrlChar = url.slice(-1);
      var paramValue = param + '=' + value;

      if (['&', '?'].indexOf(lastUrlChar) > -1) {
        url += paramValue;
      } else if (url.indexOf('?') > -1) {
        url += '&' + paramValue;
      } else {
        url += '?' + paramValue;
      }

      return url;
    },

  createForm: function createForm(divId, processId, iframeUrl, options) {
      var iframeContainer;
      var iframe;

      if (typeof divId !== 'string' || divId === '') {
        throw new InvalidParameter('Div id');
      }

      if (typeof processId !== 'string' || processId === '') {
        throw new InvalidParameter('Process id');
      }

      Settings.DivId = divId;

      iframeContainer = document.getElementById(divId);

      if (!iframeContainer) {
        throw new DivDoesNotExist(divId);
      }

      iframe = document.createElement('iframe');

      iframeUrl = internalMethods.addParamToUrl(iframeUrl, 'process_id', processId);

      if (options !== undefined) {
        if (options.styles !== undefined) {
          styles = encodeURIComponent(JSON.stringify(styles));
          iframeUrl = internalMethods.addParamToUrl(iframeUrl, 'styles', styles);
        }

        if (options.responseHandler !== undefined) {
          Settings.Handler = options.responseHandler;
        }
      }

      iframe.src = iframeUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.borderWidth = '0px';

      iframeContainer.innerHTML = '';
      iframeContainer.appendChild(iframe);

      internalMethods.setListener();
    },

    clearElement: function clearElement(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  var Bancard = function Bancard() {};

  Bancard.prototype.Checkout = function Checkout() {};
  Bancard.prototype.Cards = function Cards() {};

  Bancard.prototype.Checkout.createForm =
    function createCheckoutForm(divId, processId, options) {
      internalMethods.createForm(divId, processId, Settings.CheckoutIframeUrl, options);
    };

  Bancard.prototype.Cards.createForm =
    function createNewCardForm(divId, processId, styles) {
      internalMethods.createForm(divId, processId, styles, Settings.NewCardIframeUrl);
    };

  Bancard.prototype.destroy = function destroy() {
    var iframeContainer = document.getElementById(Settings.DivId);

    window.removeEventListener('message', internalMethods.responseHandler);

    if (iframeContainer) {
      internalMethods.clearElement(iframeContainer);
    }

    Settings.DivId = null;
  };

  var DivDoesNotExist = function DivDoesNotExist(divId) {
    this.name = 'DivDoesNotExist';
    this.message = 'Div with id: ' + divId + ' could not be found.';
    this.stack = (new Error()).stack;
  };

  DivDoesNotExist.prototype = new Error();

  var InvalidParameter = function InvalidParameter(parameter) {
    this.name = 'InvalidParameter';
    this.message = parameter + ' must be a non empty string.';
    this.stack = (new Error()).stack;
  };

  InvalidParameter.prototype = new Error();

  Bancard.prototype.exceptions = {
    'DivDoesNotExist': DivDoesNotExist,
    'InvalidParameter': InvalidParameter
  };

  if (typeof (window.Bancard) === 'undefined') {
    window.Bancard = new Bancard();
  }
})(window));
