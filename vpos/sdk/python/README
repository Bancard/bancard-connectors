
# Bancard VPOS 1.0 Python library

## Getting Started

This library allows developers to integrates their Python backend applications to the Bancard VPOS API.

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

* Downlaod and install Python 3.x (https://www.python.org/downloads/).
* Run `pip3 install bancardpythonconnector`.
* Import and use library in your source code:
```
from decimal import Decimal
from bancardconnectorpython import connector, BancardAPI, BancardAPIException

# this will autoconfigure the connector from the following OS environment variables:
# BANCARD_ENVIRONMENT=sandbox|production
# BANCARD_PUBLIC_KEY=your_public_key
# BANCARD_PRIVATE_KEY=your_private_key
api = bancardpythonconnector.connector

# or you could just create your own BancardAPI
api = BancardAPI(environment=BancardAPI.ENVIRONMENT_SANDBOX, public_key=your_public_key, private_key=your_private_key)

try:
    marketplace_charge_id = "123" # your own custom charge ID
    amount = Decimal("1000") # the amount you want to charge
    description = "Sample charge" # a message you want to show to the payer
    approved_url = "htpps://your-domain.com/webhooks/bancard/approved"  # bancard will redirect to the payer to this URL after finishing the payment
    cancelled_url = "htpps://your-domain.com/webhooks/bancard/cancelled"  # bancard will redirecto to the payer to this URL is the payment do not succeed

    # bancard_process_id is the charge ID that bancard generated
    # payment_url is the URL that you should show to the payer in case you want him to pay within the Bancard website
    # bancard_response is the JSON object that contains the exact response from bancard
    bancard_process_id, payment_url, bancard_response = api.generate_charge_token(marketplace_charge_id, amount, description, approved_url, cancelled_url)
except BancardAPIException:
    pass # see the exceptions.py file to see all the exceptions that could occur
```


## Sample code

* View the files under the `./tests/` folder for examples of how to use it.

## Running tests

* Downlaod and install Python 3.x (https://www.python.org/downloads/)
* Install the library from PYPI: `pip3 install bancardconnectorpython`
* Run any of the tests: `python3 ./tests/test_bancard_rollback.py `

## Versioning

For the versions available, see the [tags on this repository](https://github.com/vcajes/bancard-connector-python/tags)

## Authors

* **Victor Cajes** - [@vcajes](https://github.com/vcajes)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

