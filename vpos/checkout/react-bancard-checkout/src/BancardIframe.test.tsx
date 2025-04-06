import { render, RenderResult, fireEvent } from "@testing-library/react";
import App from "./BancardIframe";
import { ERRORES } from "./components/Error/ErrorComponent";
import { responseHandler, BURL } from "./utils";

const IFRAME_TITLE = "BANCARD_FORM";

describe("<App />", () => {
  describe("Checkout", () => {
    let component: RenderResult;
    let iFrame: HTMLElement;
    const processId = "1234";

    beforeAll(() => {
      component = render(<App processId={processId} />);
    });

    afterAll(() => {
      component.unmount();
    });

    test("It creates the iframe", () => {
      iFrame = component.getByTitle(IFRAME_TITLE);
    });

    test("Iframe points to correct URL", () => {
      const src = iFrame.getAttribute("src");
      const url = `${BURL}/checkout/new?process_id=${processId}`;
      expect(src).toBe(url);
    });
  });

  describe("Cards", () => {
    let component: RenderResult;
    let iFrame: HTMLElement;
    const processId = "5678";
    const processType: iFrameType = "NewCard";

    beforeAll(() => {
      component = render(
        <App processId={processId} processType={processType} />
      );
    });

    afterAll(() => {
      component.unmount();
    });

    test("It creates the iframe", () => {
      iFrame = component.getByTitle(IFRAME_TITLE);
    });

    test("Iframe points to correct URL", () => {
      const src = iFrame.getAttribute("src");
      const url = `${BURL}/checkout/register_card/new?process_id=${processId}`;
      expect(src).toBe(url);
    });
  });

  describe("Zimple", () => {
    let component: RenderResult;
    let iFrame: HTMLElement;
    const processId = "91011";
    const processType: iFrameType = "Zimple";

    beforeAll(() => {
      component = render(
        <App processId={processId} processType={processType} />
      );
    });

    afterAll(() => {
      component.unmount();
    });

    test("It creates the iframe", () => {
      iFrame = component.getByTitle(IFRAME_TITLE);
    });

    test("Iframe points to correct URL", () => {
      const src = iFrame.getAttribute("src");
      const url = `${BURL}/checkout/zimple/new?process_id=${processId}`;
      expect(src).toBe(url);
    });
  });

  describe("Confirmation", () => {
    let component: RenderResult;
    let iFrame: HTMLElement;
    const aliasToken = "mi-token";
    const processType: iFrameType = "Confirmation";

    beforeAll(() => {
      component = render(
        <App aliasToken={aliasToken} processType={processType} />
      );
    });

    afterAll(() => {
      component.unmount();
    });

    test("It creates the iframe", () => {
      iFrame = component.getByTitle(IFRAME_TITLE);
    });

    test("Iframe points to correct URL", () => {
      const src = iFrame.getAttribute("src");
      const url = `${BURL}/alias_token/confirmation/new?alias_token=${aliasToken}`;
      expect(src).toBe(url);
    });
  });

  describe("Preauthorization", () => {
    let component: RenderResult;
    let iFrame: HTMLElement;
    const processId = "121314";
    const processType: iFrameType = "Preauthorization";

    beforeAll(() => {
      component = render(
        <App processId={processId} processType={processType} />
      );
    });

    afterAll(() => {
      component.unmount();
    });

    test("It creates the iframe", () => {
      iFrame = component.getByTitle(IFRAME_TITLE);
    });

    test("Iframe points to correct URL", () => {
      const src = iFrame.getAttribute("src");
      const url = `${BURL}/checkout/preauthorization/new?process_id=${processId}`;
      expect(src).toBe(url);
    });
  });

  describe("Response Handler", () => {
    let listenerEvent: (e: MessageEvent) => void;
    const { location } = window;

    beforeEach(() => {
      //@ts-ignore
      delete window.location;
      window.location = { ...location, replace: jest.fn() };
    });

    afterEach(() => {
      window.removeEventListener("message", listenerEvent);
      window.location = location;
    });

    test("It redirects to correct URL when no customHandler parameter", (done) => {
      const url = "http://example.com";
      const message = "sample";

      listenerEvent = (e: MessageEvent) => {
        responseHandler(e, jest.fn);
        expect(window.location.replace).toHaveBeenLastCalledWith(
          `${url}?status=${message}`
        );
        done();
      };

      window.addEventListener("message", listenerEvent);

      fireEvent(
        window,
        new MessageEvent("message", {
          data: { return_url: url, message },
          origin: BURL,
        })
      );
    });

    test("Execute the customeHandler function when passed as a parameter", (done) => {
      const url = "http://example.com";
      const message = "sample";
      const customHandler = jest.fn();

      listenerEvent = (e: MessageEvent) => {
        responseHandler(e, jest.fn, customHandler);
        expect(window.location.replace).toHaveBeenCalledTimes(0);
        expect(customHandler).toHaveBeenCalledWith({
          return_url: url,
          message,
        });
        done();
      };

      window.addEventListener("message", listenerEvent);

      fireEvent(
        window,
        new MessageEvent("message", {
          data: { return_url: url, message },
          origin: BURL,
        })
      );
    });
  });

  describe("ErrorComponent renders correctly", () => {
    let component: RenderResult;

    afterEach(() => {
      component.unmount();
    });

    test("When processId and aliasToken props are not passed", () => {
      component = render(<App />);
      component.getByText(ERRORES[1]);
    });

    test("When the type of process is not Confirmation and the processId is not passed", () => {
      component = render(<App processType="NewCard" aliasToken="my-token" />);
      component.getByText(ERRORES[2]);
    });

    test("When the type of process is Confirmation and the aliasToken is not passed", () => {
      component = render(<App processType="Confirmation" processId="123456" />);
      component.getByText(ERRORES[3]);
    });
  });
});
