import exceptions from './bancard-checkout-exceptions';
import constants from './constants';

const CHECKOUT_IFRAME_URL = `${constants.BANCARD_URL}/checkout/new`;
const NEW_CARD_IFRAME_URL = `${constants.BANCARD_URL}/checkout/register_card/new`;
const ALLOWED_STYLES_URL = `${constants.BANCARD_URL}/checkout/allowed_styles`;

const Settings = {
  handler: 'default',
};

const internalMethods = {
  redirect: (data) => {
    const { message, details, return_url: returnUrl } = data;

    let url = internalMethods.addParamToUrl(returnUrl, 'status', message);

    if (typeof details !== 'undefined') {
      url = internalMethods.addParamToUrl(url, 'description', details);
    }

    window.location.replace(url);
  },

  updateMinHeight: (iframeHeight, divId) => {
    const iframe = document.querySelectorAll(`#${divId} iframe`)[0];
    iframe.style.minHeight = `${iframeHeight}px`;
  },

  setListener: (divId) => {
    window.addEventListener('message', e => internalMethods.responseHandler(e, divId));
  },

  responseHandler: (event, divId) => {
    if (event.origin !== constants.BANCARD_URL) {
      return;
    }

    if (typeof event.data.iframeHeight !== 'undefined') {
      internalMethods.updateMinHeight(event.data.iframeHeight, divId);
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
      .request('GET', ALLOWED_STYLES_URL)
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

  initializeIframe: (divId, iFrameUrl, options) => {
    if (typeof divId !== 'string' || divId === '') {
      throw new exceptions.InvalidParameter('Div id');
    }

    const iframeContainer = window.document.getElementById(divId);

    if (!iframeContainer) {
      throw new exceptions.DivDoesNotExist(divId);
    }

    let newIframeUrl = iFrameUrl;

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

    const iframe = window.document.createElement('iframe');

    iframe.src = newIframeUrl;
    iframe.style.width = '100%';
    iframe.style.borderWidth = '0px';

    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);

    internalMethods.setListener(divId);
  },

  createForm: ({
    divId, processId, options, url,
  }) => {
    if (typeof processId !== 'string' || processId === '') {
      throw new exceptions.InvalidParameter('Process id');
    }

    const iFrameUrl = internalMethods.addParamToUrl(url, 'process_id', processId);

    internalMethods.initializeIframe(divId, iFrameUrl, options);
  },

  clearElement: (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
};

class Bancard {
  get Checkout() {
    return {
      createForm: (divId, processId, options) => {
        this.divId = divId;
        internalMethods.createForm({
          divId, processId, options, url: CHECKOUT_IFRAME_URL,
        });
      },
    };
  }

  get Cards() {
    return {
      createForm: (divId, processId, options) => {
        this.divId = divId;
        internalMethods.createForm({
          divId, processId, options, url: NEW_CARD_IFRAME_URL,
        });
      },
    };
  }

  destroy() {
    const iframeContainer = window.document.getElementById(this.divId);

    window.removeEventListener('message', internalMethods.responseHandler);

    if (iframeContainer) {
      internalMethods.clearElement(iframeContainer);
    }

    this.divId = null;
  }
}

export default Bancard;
