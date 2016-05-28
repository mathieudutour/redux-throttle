redux-throttle
=============

[![build status](https://img.shields.io/travis/mathieudutour/redux-throttle/master.svg?style=flat-square)](https://travis-ci.org/mathieudutour/redux-throttle)
[![npm version](https://img.shields.io/npm/v/redux-throttle.svg?style=flat-square)](https://www.npmjs.com/package/redux-throttle)
[![Dependency Status](https://david-dm.org/mathieudutour/redux-throttle.svg)](https://david-dm.org/mathieudutour/redux-throttle)
[![devDependency Status](https://david-dm.org/mathieudutour/redux-throttle/dev-status.svg)](https://david-dm.org/mathieudutour/redux-throttle#info=devDependencies)

Redux middleware to throttle your actions

```bash
npm install --save redux-throttle
```

## Usage

```js
import {createStore, applyMiddleware} from "redux";
import throttle from "redux-throttle";
import reducers from "./reducers";
import actionTypes from "./constants/actionTypes";

const defaultWait = 300
const defaultThrottleOption = { // https://lodash.com/docs#throttle
  leading: true,
  trailing: true
}

const middleware = throttleActions(defaultWait, defaultThrottleOption);
const store = applyMiddleware(middleware)(createStore)(reducers);
```

Then you just have to dispatch actions with the meta `throttle`:

```js
{
  type: 'ACTION_TYPE',
  meta: {
    throttle: true
  }
}

{
  type: 'ACTION_TYPE_2',
  meta: {
    throttle: 300 // wait time
  }
}

{
  type: 'ACTION_TYPE_3',
  meta: {
    throttle: {
      wait: 300,
      leading: false
    }
  }
}

```

There are 2 special actions exported by the library:

```js
import {CANCEL, FLUSH} from "redux-throttle";

dispatch({
  type: CANCEL,
  payload: {
    type: 'ACTION_TYPE'
  }
})

dispatch({
  type: FLUSH,
  payload: {
    type: ['ACTION_TYPE_2', 'ACTION_TYPE_3']
  }
})

dispatch({ // will flush everything
  type: FLUSH
})
```

Both of them can be used to respectively cancel or flush a throttled action.

## License

  MIT
