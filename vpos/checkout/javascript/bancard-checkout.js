((function bancard(window) {
  var BancardUrl = 'https://desa.infonet.com.py:8085';

  var Constants = {
    DefaultIframeMinHeight: 175
  };

  var Settings = {
    CheckoutIframeUrl: BancardUrl + '/checkout/new',
    DivId: null,
    handler: 'default'
  };

  var internalMethods = {
    redirect: function redirect(data) {
      var url = data.return_url;
      var status = data.message;

      url = internalMethods.addParamToUrl(url, 'status', status);
      location.assign(url);
    },

    updateMinHeight: function updateMinHeight(offset) {
      var iframe = document.querySelectorAll('#' + Settings.DivId + ' iframe')[0];
      iframe.style.minHeight = Constants.DefaultIframeMinHeight + offset + 'px';
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.responseHandler);
    },

    responseHandler: function responseHandler(event) {
      if (event.origin !== BancardUrl) {
        return;
      }

      if (typeof event.data.offset !== 'undefined') {
        internalMethods.updateMinHeight(event.data.offset);
        return;
      }

      if (Settings.handler === 'default') {
        internalMethods.redirect(event.data);
      } else {
        Settings.handler(event.data);
      }
    },

    addParamToUrl: function addParamToUrl(url, param, value) {
      var lastUrlChar = url.slice(-1);
      var paramValue = param + '=' + value;
      var newUrl = url;

      if (['&', '?'].indexOf(lastUrlChar) > -1) {
        newUrl += paramValue;
      } else if (url.indexOf('?') > -1) {
        newUrl += '&' + paramValue;
      } else {
        newUrl += '?' + paramValue;
      }

      return newUrl;
    },

    createForm: function createForm(divId, processId, iframeUrl, options) {
      var iframeContainer;
      var iframe;
      var newIframeUrl;
      var styles;

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

      newIframeUrl = internalMethods.addParamToUrl(iframeUrl, 'process_id', processId);

      if (typeof options !== 'undefined') {
        if (typeof options.styles !== 'undefined') {
          styles = encodeURIComponent(JSON.stringify(options.styles));
          newIframeUrl = internalMethods.addParamToUrl(newIframeUrl, 'styles', styles);
        }

        if (typeof options.responseHandler !== 'undefined') {
          Settings.handler = options.responseHandler;
        }
      }

      iframe.src = newIframeUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.minHeight = Constants.DefaultIframeMinHeight + 'px';
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

  Bancard.prototype.Checkout.createForm =
    function createCheckoutForm(divId, processId, options) {
      internalMethods.createForm(divId, processId, Settings.CheckoutIframeUrl, options);
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
