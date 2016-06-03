import throttle from 'lodash.throttle'

export const CANCEL = 'redux-throttle/CANCEL'
export const FLUSH = 'redux-throttle/FLUSH'

function map (throttled, action, method) {
  if (action.payload && action.payload.type) {
    let types = action.payload.type
    if (!Array.isArray(types)) {
      types = [types]
    }
    Object.keys(throttled)
      .filter((t) => types.includes(t))
      .forEach((t) => throttled[t][method]())
    return
  }
  Object.keys(throttled).forEach((t) => throttled[t][method]())
  return
}

export default function middleware (defaultWait = 300, defaultThrottleOption = {}) {
  const throttled = {}
  return (store) => (next) => (action) => {
    if (action.type === CANCEL) {
      map(throttled, action, 'cancel')
      return next(action)
    }

    if (action.type === FLUSH) {
      map(throttled, action, 'flush')
      return next(action)
    }

    const shouldThrottle = (action.meta || {}).throttle

    // check if we don't need to throttle the action
    if (!shouldThrottle) {
      return next(action)
    }

    if (throttled[action.type]) { // if it's a action which was throttled already
      return throttled[action.type](action)
    }

    let wait = defaultWait
    let options = defaultThrottleOption

    if (!isNaN(shouldThrottle) && shouldThrottle !== true) {
      wait = shouldThrottle
    } else if (typeof shouldThrottle === 'object') {
      wait = shouldThrottle.wait || defaultWait
      options = {...defaultThrottleOption, ...shouldThrottle}
    }

    throttled[action.type] = throttle(next, wait, options)

    return throttled[action.type](action)
  }
}
