type iFrameStyles = {
  "form-background-color"?: string;
  "button-background-color"?: string;
  "button-text-color"?: string;
  "button-border-color"?: string;
  "input-background-color"?: string;
  "input-text-color"?: string;
  "input-placeholder-color"?: string;
};

type iFrameType =
  | "Checkout"
  | "NewCard"
  | "Zimple"
  | "Confirmation"
  | "Preauthorization";

interface IData {
  message?: string;
  details?: string;
  return_url?: string;
  iframeHeight?: number;
}
