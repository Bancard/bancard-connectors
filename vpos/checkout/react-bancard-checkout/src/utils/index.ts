import { Dispatch, SetStateAction } from "react";

//Constants
const devURL = "https://vpos.infonet.com.py:8888";
const proURL = "https://vpos.infonet.com.py";
const isProduction = process.env.NODE_ENV === "production";
export const BURL = isProduction ? proURL : devURL;
const CHECKOUT_IFRAME_URL = `${BURL}/checkout/new`;
const NEW_CARD_IFRAME_URL = `${BURL}/checkout/register_card/new`;
const ZIMPLE_IFRAME_URL = `${BURL}/checkout/zimple/new`;
const CONFIRMATION_IFRAME_URL = `${BURL}/alias_token/confirmation/new`;
const PREAUTHORIZATION_IFRAME_URL = `${BURL}/checkout/preauthorization/new`;

/** Object whose keys return the corresponding url */
export const IFRAME_TYPE = {
  Checkout: CHECKOUT_IFRAME_URL,
  NewCard: NEW_CARD_IFRAME_URL,
  Zimple: ZIMPLE_IFRAME_URL,
  Confirmation: CONFIRMATION_IFRAME_URL,
  Preauthorization: PREAUTHORIZATION_IFRAME_URL,
};

//Utils functions
/** Function that redirects to the confirmation or cancellation url */
const redirect = (data: IData) => {
  const { message, details, return_url: returnUrl } = data;

  if (!returnUrl || !message) return;

  let url = addParamToUrl(returnUrl, "status", message);

  if (typeof details !== "undefined") {
    url = addParamToUrl(url, "description", details);
  }
  window.location.replace(url);
};

/** Function that adds parameters to the url */
export const addParamToUrl = (url: string, param: string, value: string) => {
  const lastUrlChar = url.slice(-1);
  const paramValue = `${param}=${value}`;
  let newUrl = url;

  if (["&", "?"].indexOf(lastUrlChar) > -1) {
    newUrl += paramValue;
  } else if (url.indexOf("?") > -1) {
    newUrl = `${newUrl}&${paramValue}`;
  } else {
    newUrl = `${newUrl}?${paramValue}`;
  }

  return newUrl;
};

/** Function that handles the iFrame message events */
export const responseHandler = (
  event: MessageEvent<IData>,
  updateMinHeight: Dispatch<SetStateAction<number>>,
  customHandler?: (data: IData) => void
) => {
  if (event.origin !== BURL) {
    return;
  }

  if (typeof event.data.iframeHeight !== "undefined") {
    updateMinHeight(event.data.iframeHeight + 1);
    return;
  }

  if (!customHandler) {
    redirect(event.data);
  } else {
    customHandler(event.data);
  }
};
