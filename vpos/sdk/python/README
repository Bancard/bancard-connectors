
# Bancard VPOS v1.0 - Bancard Python Connector v0.5.4 library

## Getting Started

This library allows developers to integrate their Python backend applications to the Bancard VPOS API.

This library works with the following Python versions: 2.6, 2.7, 3.3, 3.4, 3.5, 3.6

### Prerequisites

See the requirements.txt file to see which Python libraries will be required.

### Usage in Staging or Production

You can either include this library from:

```
https://github.com/vcajes/bancard-connector-python
```

Or install the library from the [PYPI repository](https://pypi.python.org/pypi/bancardconnectorpython/):

```
pip3 install bancardconnectorpython
```

### Usage in development

* Download and install [Python (2.6 <= version <= 3.6)](https://www.python.org/downloads/).
* Run `pip install bancardconnectorpython`.
* Import and use library in your source code:
```
from decimal import Decimal
import bancardconnectorpython

# this will autoconfigure the connector from the following OS environment variables:
# BANCARD_ENVIRONMENT=sandbox|production
# BANCARD_PUBLIC_KEY=your_public_key
# BANCARD_PRIVATE_KEY=your_private_key
bancard_api = bancardconnectorpython.connector()

# or you could just create your own BancardAPI
bancard_api = bancardconnectorpython.BancardAPI(environment=bancardconnectorpython.ENVIRONMENT_SANDBOX, public_key=your_public_key, private_key=your_private_key)
```

## Sample code - Bancard Single Buy

```
# bancard sample charge information
marketplace_charge_id = "123"  # your own custom charge ID
amount = Decimal("1000")  # the amount you want to charge
currency = "PYG"  # currently the only allowed currency by Bancard
description = "Sample charge"  # a message you want to show to the payer
approved_url = "htpps://your-domain.com/webhooks/bancard/approved"  # bancard will redirect to the payer to this URL after finishing the paymentcancelled_url = "htpps://your-domain.com/webhooks/bancard/cancelled"  # bancard will redirect to the payer to this URL is the payment do not succeed
cancelled_url = "htpps://your-domain.com/webhooks/bancard/cancelled"  # bancard will redirect to the payer to this URL is the payment do not succeed

try:
    # bancard_process_id is the charge ID that bancard generated
    # payment_url is the URL that you should show to the payer in case you want him to pay within the Bancard website
    # bancard_response is the JSON object that contains the exact response from bancard
    bancard_process_id, payment_url, bancard_response = bancard_api.generate_charge_token(marketplace_charge_id, amount, description, approved_url, cancelled_url, currency)
except BancardAPIInvalidParameterException as bancard_error1:
    print(bancard_error1.msg)  # message returned by Bancard if any
    print(bancard_error1.data)  # JSON object that contains the exact response from bancard
except BancardAPIChargeRejectedException as bancard_error2:
    print(bancard_error2.msg)  # message returned by Bancard if any
    print(bancard_error2.data)  # JSON object that contains the exact response from bancard
except BancardAPIMarketplaceChargeIDAlreadyExistsException as bancard_error3:
    print(bancard_error3.msg)  # message returned by Bancard if any
    print(bancard_error3.data)  # JSON object that contains the exact response from bancard

    # the marketplace ID "123" was already used previously in Bancard, so you would want to check the status of that previous charge
    # already_payed is a True/False boolean that defines if the charge has already been payed by someone
    # authorization_number will be the string with the Bancard authorization code. This will be None if already_payed is False
    # bancard_response is the JSON object that contains the exact response from bancard
    already_payed, authorization_number, bancard_response = bancard_api.get_charge_status(marketplace_charge_id, amount, currency)
except BancardAPIException as bancard_error4:
    print(bancard_error4.msg)  # message returned by Bancard if any
    print(bancard_error4.data)  # JSON object that contains the exact response from bancard
```

## Sample code - Bancard Confirmations

```
# bancard sample confirmations call to obtain the status of the charge
marketplace_charge_id = "123"  # your own custom charge ID
amount = Decimal("1000")  # the amount you want to charge
currency = "PYG"  # currently the only allowed currency by Bancard

try:
    # already_payed is a True/False boolean that defines if the charge has already been payed by someone
    # authorization_number will be the string with the Bancard authorization code. This will be None if already_payed is False
    # bancard_response is the JSON object that contains the exact response from bancard
    already_payed, authorization_number, bancard_response = bancard_api.get_charge_status(marketplace_charge_id, amount, currency)
except BancardAPIInvalidParameterException as bancard_error1:
    print(bancard_error1.msg)  # message returned by Bancard if any
    print(bancard_error1.data)  # JSON object that contains the exact response from bancard
except BancardAPIChargeInconsistentValuesException as bancard_error2:
    print(bancard_error2.msg)  # message returned by Bancard if any
    print(bancard_error2.data)  # JSON object that contains the exact response from bancard
except BancardAPIPaymentMethodNotEnabledException as bancard_error3:
    print(bancard_error3.msg)  # message returned by Bancard if any
    print(bancard_error3.data)  # JSON object that contains the exact response from bancard
except BancardAPIPaymentTransactionInvalidException as bancard_error4:
    print(bancard_error4.msg)  # message returned by Bancard if any
    print(bancard_error4.data)  # JSON object that contains the exact response from bancard
except BancardAPIPaymentMethodNotEnoughFundsException as bancard_error5:
    print(bancard_error5.msg)  # message returned by Bancard if any
    print(bancard_error5.data)  # JSON object that contains the exact response from bancard
except BancardAPIPaymentRejectecUnknownReasonException as bancard_error6:
    print(bancard_error6.msg)  # message returned by Bancard if any
    print(bancard_error6.data)  # JSON object that contains the exact response from bancard
except BancardAPIPaymentRejectecUnknownReasonException as bancard_error7:
    print(bancard_error7.msg)  # message returned by Bancard if any
    print(bancard_error7.data)  # JSON object that contains the exact response from bancard
except BancardAPIException as bancard_error8:
    print(bancard_error8.msg)  # message returned by Bancard if any
    print(bancard_error8.data)  # JSON object that contains the exact response from bancard
```

## Sample code - Bancard Rollback

```
# bancard sample confirmations call to obtain the status of the charge
marketplace_charge_id = "123"  # your own custom charge ID

try:
    # successfull_rollback is a True/False boolean that defines if the charge has been successfully rolled-back by Bancard
    # bancard_response is the JSON object that contains the exact response from bancard
    successfull_rollback, bancard_response = bancard_api.rollback_charge(marketplace_charge_id)
except BancardAPIInvalidParameterException as bancard_error1:
    print(bancard_error1.msg)  # message returned by Bancard if any
    print(bancard_error1.data)  # JSON object that contains the exact response from bancard
except BancardAPINotRolledBackException as bancard_error2:
    print(bancard_error2.msg)  # message returned by Bancard if any
    print(bancard_error2.data)  # JSON object that contains the exact response from bancard
except BancardAPIException as bancard_error3:
    print(bancard_error3.msg)  # message returned by Bancard if any
    print(bancard_error3.data)  # JSON object that contains the exact response from bancard
```

## Running tests

* Download and install [Python (2.6 <= version <= 3.6)](https://www.python.org/downloads/)
* Install the library from PYPI: `pip install bancardconnectorpython`
* Set the following two OS environment variables `BANCARD_PUBLIC_KEY` and `BANCARD_PRIVATE_KEY` with the values provided by Bancard.
* Run any of the tests, i.e.: `python /path/to/tests/test_bancard_single_buy.py `

## Versioning

For the versions available, see the [tags on this repository](https://github.com/vcajes/bancard-connector-python/tags)

## Authors

* **Victor Cajes** - [@vcajes](https://github.com/vcajes)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

