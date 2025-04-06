import { useCallback, useEffect, useState } from "react";
import { ErrorComponent } from "./components";
import { addParamToUrl, responseHandler, IFRAME_TYPE } from "./utils";

type BancardIframeProps = {
  /** Process identifier (processId) to be used to invoke the iframe of occasional payment */
  processId?: string;
  aliasToken?: string;
  /** The type of process to be carried out in this operation */
  processType?: iFrameType;
  /** You can pass options to customize the styles of the iFrame or to add a custom response handler */
  options?: {
    /** Only HEX, HSL and RGB formats are valid */
    styles?: iFrameStyles;
    /**
     * Custom response handler.
     * You can pass a function to modify the default behavior of the component that would redirect to the return url.
     * @param {IData} data vpos response object
     */
    handler?: (data: IData) => void;
  };
};

/** This component returns an iFrame that allows loading the form in the trade site */
export default function BancardIframe({
  processId,
  aliasToken,
  processType = "Checkout",
  options,
}: BancardIframeProps) {
  //State for iFrameHeight
  const [iFrameHeight, setIframeHeight] = useState(367);

  //Event handler for the message listener
  const eventHandler = useCallback(
    (e: MessageEvent) => responseHandler(e, setIframeHeight, options?.handler),
    [options?.handler]
  );

  //We add a listener to capture the messages sent by vpos
  useEffect(() => {
    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [eventHandler]);

  //We validate that the processID and aliasToken props are passed
  if (!processId && !aliasToken) return <ErrorComponent errorCode={1} />;
  if (processType !== "Confirmation" && !processId)
    return <ErrorComponent errorCode={2} />;
  if (processType === "Confirmation" && !aliasToken)
    return <ErrorComponent errorCode={3} />;

  //We create the url according to the type of iFrame that we must render
  const url = IFRAME_TYPE[processType];
  let iFrameUrl = url;
  if (processId && processType !== "Confirmation")
    iFrameUrl = addParamToUrl(url, "process_id", processId);

  if (aliasToken && processType === "Confirmation")
    iFrameUrl = addParamToUrl(url, "alias_token", aliasToken);

  //We check if parameters were passed to style the iFrame and add it to the url
  let newIframeUrl = iFrameUrl;
  if (options && options.styles && Object.keys(options.styles).length > 0) {
    const styles = encodeURIComponent(JSON.stringify(options.styles));
    newIframeUrl = addParamToUrl(iFrameUrl, "styles", styles);
  }

  //We return to the iFrame
  return (
    <iframe
      title="BANCARD_FORM"
      src={newIframeUrl}
      style={{ width: 500, height: iFrameHeight, borderWidth: 0 }}
    />
  );
}
