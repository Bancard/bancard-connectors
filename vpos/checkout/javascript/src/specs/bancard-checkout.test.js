import Bancard from '../bancard-checkout';
import exceptions from '../bancard-checkout-exceptions';
import constants from '../constants';

describe('Bancard', () => {
  let instance;
  beforeEach(() => { instance = new Bancard(); });

  describe('Initialize iFrame', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="targetDiv" />';
    });

    describe('Checkout', () => {
      beforeEach(() => {
        instance.Checkout.createForm('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It creates the iframe', () => {
        expect(document.querySelectorAll('iframe').length).toBe(1);
      });

      test('Iframe points to correct URL', () => {
        expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
          .toBe('https://desa.infonet.com.py:8085/checkout/new?process_id=1234');
      });
    });

    describe('Cards', () => {
      beforeEach(() => {
        instance.Cards.createForm('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It creates the iframe', () => {
        expect(document.querySelectorAll('iframe').length).toBe(1);
      });

      test('Iframe points to correct URL', () => {
        expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
          .toBe('https://desa.infonet.com.py:8085/checkout/register_card/new?process_id=1234');
      });
    });

    describe('Zimple', () => {
      beforeEach(() => {
        instance.Zimple.createForm('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It creates the iframe', () => {
        expect(document.querySelectorAll('iframe').length).toBe(1);
      });

      test('Iframe points to correct URL', () => {
        expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
          .toBe('https://desa.infonet.com.py:8085/checkout/zimple/new?process_id=1234');
      });
    });

    describe('Confirmation', () => {
      beforeEach(() => {
        instance.Confirmation.loadPinPad('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It creates the iframe', () => {
        expect(document.querySelectorAll('iframe').length).toBe(1);
      });

      test('Iframe points to correct URL', () => {
        expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
          .toBe('https://desa.infonet.com.py:8085/alias_token/confirmation/new?alias_token=1234');
      });
    });

    describe('When valid div', () => {
      beforeEach(() => {
        instance.Checkout.createForm('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It redirects to correct URL', (done) => {
        constants.BANCARD_URL = '';
        const url = 'http://example.com';
        const message = 'sample';

        window.addEventListener('message', () => {
          expect(window.location.replace).toBeCalledWith(`${url}?status=${message}`);
          done();
        });

        window.postMessage({ return_url: url, message }, '*');
      });

      describe('When invalid styles', () => {
        const customStyles = {
          'wrong-style': '#FFFFFF',
          'header-text-color': '#FFFFFF',
          'header-show': 'wrong-value',
        };

        const options = { styles: customStyles };

        beforeEach(() => { instance.Checkout.createForm('targetDiv', '1234', options); });

        afterEach(() => { instance.destroy(); });

        const allowedStyles = {
          'header-background-color': 'color',
          'header-text-color': 'color',
          'header-show': 'boolean',
        };

        global.console = { warn: jest.fn() };
        fetch.mockResponse(JSON.stringify({ allowed_styles: allowedStyles }));

        test('It throws a warning', () => {
          expect(global.console.warn)
            .toHaveBeenCalledWith('Invalid Value: the value wrong-value for the style header-show is not valid.');
          expect(global.console.warn)
            .toHaveBeenCalledWith('Invalid Style Object: the style wrong-style is not allowed');
        });
      });

      describe('When destroying the library', () => {
        test("It's correctly destroyed", () => {
          instance.destroy();

          expect(document.querySelectorAll('iframe').length).toBe(0);
        });

        test("Calling destroy twice doesn't break the page", () => {
          instance.destroy();
          instance.destroy();
        });

        test('It can be reinitialized correctly', () => {
          instance.Checkout.createForm('targetDiv', '1234');

          expect(document.querySelectorAll('iframe').length).toBe(1);
        });
      });
    });

    describe('Preauthorization', () => {
      beforeEach(() => {
        instance.Preauthorization.createForm('targetDiv', '1234');
        window.location.replace = jest.fn();
      });

      afterEach(() => { instance.destroy(); });

      test('It creates the iframe', () => {
        expect(document.querySelectorAll('iframe').length).toBe(1);
      });

      test('Iframe points to correct URL', () => {
        expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
          .toBe('https://desa.infonet.com.py:8085/checkout/preauthorization/new?process_id=1234');
      });
    });
  });

  describe('When the div does not exist', () => {
    afterEach(() => { instance.destroy(); });

    test('It throws exception', () => {
      expect(() => { instance.Checkout.createForm('nonexistentDiv', '1234'); })
        .toThrowError(exceptions.DivDoesNotExist);
    });
  });

  describe('When invalid process id', () => {
    afterEach(() => { instance.destroy(); });

    test('It throws exception', () => {
      expect(() => { instance.Checkout.createForm('targetDiv', ''); })
        .toThrowError(exceptions.InvalidParameter);
    });

    test('It throws exception', () => {
      expect(() => { instance.Checkout.createForm('targetDiv', 23); })
        .toThrowError(exceptions.InvalidParameter);
    });
  });

  describe('When invalid alias token', () => {
    afterEach(() => { instance.destroy(); });

    test('It throws exception', () => {
      expect(() => { instance.Confirmation.loadPinPad('targetDiv', ''); })
        .toThrowError(exceptions.InvalidParameter);
    });

    test('It throws exception', () => {
      expect(() => { instance.Confirmation.loadPinPad('targetDiv', 23); })
        .toThrowError(exceptions.InvalidParameter);
    });
  });
});
