((function bancard(window) {
  var BancardUrl = 'https://desa.infonet.com.py:8085';

  var Settings = {
    CheckoutIframeUrl: BancardUrl + '/checkout/new',
    DivId: null
  };

  var internalMethods = {
    redirect: function redirect(event) {
      if (event.origin !== BancardUrl) {
        return;
      }

      var url = event.data.return_url;
      var status = event.data.message;

      url = internalMethods.addParamToUrl(url, 'status', status);
      location.assign(url);
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.redirect);
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

    createForm: function createForm(divId, processId, styles, iframeUrl) {
      var iframeContainer, iframe;

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

      if (typeof styles !== 'undefined') {
        styles = encodeURIComponent(JSON.stringify(styles));
        iframeUrl = internalMethods.addParamToUrl(iframeUrl, 'styles', styles);
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

  Bancard.prototype.Checkout.createForm =
    function createCheckoutForm(divId, processId, styles) {
      internalMethods.createForm(divId, processId, styles, Settings.CheckoutIframeUrl);
    };

  Bancard.prototype.destroy = function destroy() {
    var iframeContainer = document.getElementById(Settings.DivId);

    window.removeEventListener('message', internalMethods.redirect);

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
