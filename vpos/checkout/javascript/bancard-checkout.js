((function bancardCheckout(window) {
  var BancardUrl = 'https://desa.infonet.com.py:8085';

  var Settings = {
    CheckoutIframeUrl: BancardUrl + '/checkout/new',
    DivId: ''
  };

  var internalMethods = {
    redirect: function redirect(event) {
      if (event.origin !== BancardUrl) {
        return;
      }

      var url = event.data.return_url;
      var status = event.data.message;

      url = internalMethods.addParamToUrl(url, 'status', status);

      window.location.replace(url);
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.redirect);
    },

    addParamToUrl: function addParamToUrl(url, param, value) {
      var lastUrlChar = url.slice(-1);
      var paramValue = param + '=' + value;

      if (['&', '?'].indexOf(url) > -1) {
        url += paramValue;
      } else if (url.indexOf('?') > -1) {
        url += '&' + paramValue;
      } else {
        url += '?' + paramValue;
      }

      return url;
    },

    createForm: function createForm(divId, processId, styles, iframeUrl) {
      var iframeContainer;
      var iframe;

      Settings.DivId = divId;

      iframeContainer = document.getElementById(divId);
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
    }
  };

  var BancardCheckout = function BancardCheckout() {};

  BancardCheckout.prototype.createCheckoutForm =
    function createCheckoutForm(divId, processId, styles) {
      internalMethods.createForm(divId, processId, styles, Settings.CheckoutIframeUrl);
    };

  BancardCheckout.prototype.destroy = function destroy() {
    var iframeContainer = document.getElementById(Settings.DivId);

    window.removeEventListener('message', internalMethods.redirect);

    while (iframeContainer.firstChild) {
      iframeContainer.removeChild(iframeContainer.firstChild);
    }
  };

  if (typeof (window.BancardCheckout) === 'undefined') {
    window.BancardCheckout = new BancardCheckout();
  }
})(window));
