
# VPOS 2.0 JS library

## Getting Started

This library allows commerces to accept payments from customers as well as manage customer cards while remaining fully PCI compliant.

### Prerequisites

There are no prerequisites to use this library.

### Usage in Staging or Production

Download the version you want from [bancard-checkout-js](https://github.com/Bancard/bancard-checkout-js/tree/master/build) and host it on your own web server.

### Usage in development

* Clone the project.
* Navigate to `vpos/checkout/javascript`.
* Install node (we suggest you use NVM - https://github.com/creationix/nvm#installation).
* Install yarn (https://yarnpkg.com/lang/en/docs/install/).
* Run `yarn install`.
* Run `yarn build-sandbox`.
* Run `yarn start`.
* Include the script from `http://localhost:8080/dist/bancard-checkout-${version}-sandbox.js`.

## Running the tests

* Run `yarn test`.

### Running the linter

* Run `yarn lint`.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Bancard/bancard-connectors/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Bancard/bancard-connectors/blob/master/LICENSE.md) file for details
