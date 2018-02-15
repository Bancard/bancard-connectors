import exceptions from './bancard-checkout-exceptions';

let BancardUrl = 'https://desa.infonet.com.py:8085';

const Settings = {
  CheckoutIframeUrl: `${BancardUrl}/checkout/new`,
  AllowedStylesUrl: `${BancardUrl}/checkout/allowed_styles`,
  DivId: null,
  handler: 'default',
};

const internalMethods = {
  redirect: (data) => {
    const { message, return_url: returnUrl } = data;
    const url = internalMethods.addParamToUrl(returnUrl, 'status', message);
    window.location.replace(url);
  },

  updateMinHeight: (iframeHeight) => {
    const iframe = document.querySelectorAll(`#${Settings.DivId} iframe`)[0];
    iframe.style.minHeight = `${iframeHeight}px`;
  },

  setListener: () => {
    window.addEventListener('message', internalMethods.responseHandler);
  },

  responseHandler: (event) => {
    if (event.origin !== BancardUrl) {
      return;
    }

    if (typeof event.data.iframeHeight !== 'undefined') {
      internalMethods.updateMinHeight(event.data.iframeHeight);
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

  request: async (method, url) => {
    const response = await fetch(url, { method });
    const data = await response.json();

    return data;
  },

  validateStyles: (styles) => {
    internalMethods
      .request('GET', Settings.AllowedStylesUrl)
      .then((data) => {
        const allowedStyles = data.allowed_styles;

        internalMethods.checkInvalidStyles(allowedStyles, styles);
      });
  },

  checkInvalidStyles: (allowedStyles, styles) => {
    const stylesNames = Object.keys(styles);

    stylesNames.forEach((styleName) => {
      if (typeof allowedStyles[styleName] === 'undefined') {
        console.warn(`Invalid Style Object: the style ${styleName} is not allowed`);
      } else {
        let showWarning = false;

        if (allowedStyles[styleName] === 'color') {
          if (styles[styleName].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) == null) {
            showWarning = true;
          }
        } else if (!['true', 'false', true, false].includes(styles[styleName])) {
          showWarning = true;
        }

        if (showWarning) {
          console.warn(`Invalid Value: the value ${styles[styleName]} for the style ${styleName} is not valid.`);
        }
      }
    });
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
    if (typeof options !== 'undefined') {
      if (typeof options.styles !== 'undefined') {
        internalMethods.validateStyles(options.styles);

        const styles = encodeURIComponent(JSON.stringify(options.styles));
        newIframeUrl = internalMethods.addParamToUrl(newIframeUrl, 'styles', styles);
      }

      if (typeof options.responseHandler !== 'undefined') {
        Settings.handler = options.responseHandler;
      }
    }

    iframe.src = newIframeUrl;
    iframe.style.width = '100%';
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

Bancard.prototype.Checkout.createForm = (divId, processId, options) => {
  internalMethods.createForm(divId, processId, Settings.CheckoutIframeUrl, options);
};

Bancard.prototype.destroy = () => {
  const iframeContainer = window.document.getElementById(Settings.DivId);

  window.removeEventListener('message', internalMethods.responseHandler);

  if (iframeContainer) {
    internalMethods.clearElement(iframeContainer);
  }

  Settings.DivId = null;
};

Bancard.prototype.setBancardUrl = (url) => {
  BancardUrl = url;
};

export default Bancard;
