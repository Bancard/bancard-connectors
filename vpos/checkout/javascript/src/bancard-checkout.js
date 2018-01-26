import exceptions from './bancard-checkout-exceptions';

((function bancard(window) {
  const BancardUrl = 'https://desa.infonet.com.py:8085';
  const DefaultIframeMinHeight = 175;

  const Settings = {
    CheckoutIframeUrl: `${BancardUrl}/checkout/new`,
    DivId: null,
    handler: 'default',
  };

  const internalMethods = {
    redirect: (data) => {
      const { message, return_url: returnUrl } = data;
      const url = internalMethods.addParamToUrl(returnUrl, 'status', message);
      window.location.assign(url);
    },

    updateMinHeight: function updateMinHeight(offset) {
      const iframe = document.querySelectorAll(`#${Settings.DivId} iframe`)[0];
      iframe.style.minHeight = `${DefaultIframeMinHeight + offset}px`;
    },

    setListener: () => {
      window.addEventListener('message', internalMethods.responseHandler);
    },

    responseHandler: (event) => {
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

    addParamToUrl: (url, param, value) => {
      const lastUrlChar = url.slice(-1);
      const paramValue = `${param}=${value}`;
      let newUrl = url;

      if (['&', '?'].indexOf(lastUrlChar) > -1) {
        newUrl += paramValue;
      } else if (url.indexOf('?') > -1) {
        newUrl = `${newUrl}&${paramValue}`;
      } else {
        newUrl = `${newUrl}?${paramValue}`;
      }

      return newUrl;
    },

    createForm: (divId, processId, iframeUrl, options) => {
      if (typeof divId !== 'string' || divId === '') {
        throw new exceptions.InvalidParameter('Div id');
      }

      if (typeof processId !== 'string' || processId === '') {
        throw new exceptions.InvalidParameter('Process id');
      }

      Settings.DivId = divId;

      const iframeContainer = window.document.getElementById(divId);

      if (!iframeContainer) {
        throw new exceptions.DivDoesNotExist(divId);
      }

      const iframe = window.document.createElement('iframe');

      let newIframeUrl = internalMethods.addParamToUrl(iframeUrl, 'process_id', processId);

      if (options !== undefined) {
        if (options.styles !== undefined) {
          const styles = encodeURIComponent(JSON.stringify(options.styles));
          newIframeUrl = internalMethods.addParamToUrl(newIframeUrl, 'styles', styles);
        }

        if (options.responseHandler !== undefined) {
          Settings.handler = options.responseHandler;
        }
      }

      iframe.src = newIframeUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.minHeight = `${DefaultIframeMinHeight}px`;
      iframe.style.borderWidth = '0px';

      iframeContainer.innerHTML = '';
      iframeContainer.appendChild(iframe);

      internalMethods.setListener();
    },

    clearElement: (element) => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
  };

  const Bancard = function Bancard() {};

  Bancard.prototype.Exceptions = exceptions;

  Bancard.prototype.Checkout = function Checkout() {};

  Bancard.prototype.Checkout.createForm =
    function createCheckoutForm(divId, processId, options) {
      internalMethods.createForm(divId, processId, Settings.CheckoutIframeUrl, options);
    };

  Bancard.prototype.destroy = function destroy() {
    const iframeContainer = window.document.getElementById(Settings.DivId);

    window.removeEventListener('message', internalMethods.responseHandler);

    if (iframeContainer) {
      internalMethods.clearElement(iframeContainer);
    }

    Settings.DivId = null;
  };

  if (typeof (window.Bancard) === 'undefined') {
    window.Bancard = new Bancard(); // eslint-disable-line no-param-reassign
  }
})(window));
