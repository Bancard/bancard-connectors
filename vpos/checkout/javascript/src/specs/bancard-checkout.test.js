require('../bancard-checkout');

describe('When valid div', () => {
  document.body.innerHTML = '<div id="targetDiv" />';
  window.Bancard.Checkout.createForm('targetDiv', '1234');

  const checkIframeCreated = () => {
    expect(document.querySelectorAll('iframe').length).toBe(1);
  };

  test('It creates the iframe', () => {
    checkIframeCreated();
  });

  test('Iframe points to correct URL', () => {
    expect(document.querySelectorAll('iframe')[0].getAttribute('src'))
      .toBe('https://desa.infonet.com.py:8085/checkout/new?process_id=1234');
  });

  test('It redirects to correct URL', (done) => {
    window.location.assign = jest.fn();

    window.addEventListener('message', () => {
      expect(window.location.assign).toBeCalledWith('http://example.com');
      done();
    });

    window.postMessage({ return_url: 'http://example.com' }, '*');
  });

  describe('When destroying the library', () => {
    test("It's correctly destroyed", (done) => {
      window.Bancard.destroy();

      expect(document.querySelectorAll('iframe').length).toBe(0);

      window.location.assign = jest.fn();

      window.addEventListener('message', () => {
        expect(window.location.assign).not.toBeCalled();
        done();
      });

      window.postMessage({ return_url: 'http://example.com' }, '*');
    });

    test("Calling destroy again doesn't break the page", () => {
      window.Bancard.destroy();
    });

    test('It can be reinitialized correctly', () => {
      window.Bancard.Checkout.createForm('targetDiv', '1234');

      checkIframeCreated();
    });
  });
});

describe('When invalid div', () => {
  test('It throws exception', () => {
    expect(() => { window.Bancard.Checkout.createForm('nonexistentDiv', '1234'); })
      .toThrowError(window.Bancard.Exceptions.DivDoesNotExist);
  });
});

describe('When invalid process_id', () => {
  test('It throws exception', () => {
    expect(() => { window.Bancard.Checkout.createForm('targetDiv', ''); })
      .toThrowError(window.Bancard.Exceptions.InvalidParameter);
  });

  test('It throws exception', () => {
    expect(() => { window.Bancard.Checkout.createForm('targetDiv', 23); })
      .toThrowError(window.Bancard.Exceptions.InvalidParameter);
  });
});
