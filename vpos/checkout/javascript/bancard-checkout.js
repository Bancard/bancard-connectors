((function bancardCheckout(window) {
  var Settings = {
    IframeUrl: 'https://desa.infonet.com.py:8085/checkout/new?is_test_client=true&',
    DivId: ''
  };

  var internalMethods = {
    redirect: function redirect(event) {
      var url = event.data.return_url;
      window.location.replace(url);
    },

    setListener: function setListener() {
      window.addEventListener('message', internalMethods.redirect);
    }
  };

  var BancardCheckout = function BancardCheckout() {};

  BancardCheckout.prototype.init = function init(divId, processId, styles) {
    var iframeUrl;
    var iframeContainer;
    var iframe;
    var lastIframeUrlChar;

    Settings.DivId = divId;

    iframeUrl = Settings.IframeUrl;
    iframeContainer = document.getElementById(divId);
    iframe = document.createElement('iframe');

    lastIframeUrlChar = iframeUrl.slice(-1);

    if (['&', '?'].indexOf(lastIframeUrlChar) > -1) {
      iframeUrl += 'process_id=' + processId;
    } else if (iframeUrl.indexOf('?') > -1) {
      iframeUrl += '&process_id=' + processId;
    } else {
      iframeUrl += '?process_id=' + processId;
    }

    if (typeof styles !== 'undefined') {
      iframeUrl += '&styles=' + encodeURIComponent(JSON.stringify(styles));
    }

    iframe.src = iframeUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.borderWidth = '0px'

    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);

    internalMethods.setListener();
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
