
# React Bancard Checkout

It's a react component that loads the Bancard secure payment iFrame based on the bancard-checkout-js 3.0.0 library.

  
## Usage/Examples

```javascript
import BancardIframe from 'react-bancard-checkout'

function App() {
  return <BancardIframe processId="1234" />
}
```

  
## Props

| Name | Type     | Required     | Description                |
| :-------- | :------- | :------- | :------------------------- |
| `processId` | `string` | `false` | Process identifier to be used to invoke the iframe of occasional payment |
| `aliasToken` | `string` | `false` | It is obtained when retrieving the list of cards of a user |
| `processType` | `iFrameType` | `false` | The type of process to be carried out in this operation |
| `options.styles` | `iFrameStyles` | `false` | Styles for the iframe. Only HEX, HSL and RGB formats are valid |
| `options.handler` | `(data: IData) => void;` | `false` | You can pass a function to modify the default behavior of the component that would redirect to the return url |


## Environment Variables

This project, depending on the execution environment, makes POST requests to the Bancard environment Staging or Production.

So when:
- `NODE_ENV === development` or `test` will use this url: `https://vpos.infonet.com.py:8888`
- `NODE_ENV === Production` will use this url: `https://vpos.infonet.com.py`


## Running Tests

To run tests, run the following command

```bash
 npm run test
```
or
```bash
 yarn test
```
  