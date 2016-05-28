import test from 'ava'
import middleware from '../src/'
import { spy } from 'sinon'

const wait = () => new Promise((resolve) => setTimeout(resolve, 300))

test.beforeEach((t) => {
  t.context.next = spy()
  const middle = middleware()
  t.context.dispatch = function d (action) {
    return middle()(t.context.next)(action)
  }
})

test('do not throttle action if meta is not present', (t) => { // eslint-disable-line
  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: 1
  })

  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: 2
  })

  t.true(t.context.next.calledTwice)
})

test('throttle action if meta is present', (t) => {
  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: 1,
    meta: {
      throttle: true
    }
  })

  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: 2,
    meta: {
      throttle: true
    }
  })

  t.true(t.context.next.calledOnce)

  t.same(t.context.next.firstCall.args[0], {
    type: 'ACTION_TYPE',
    payload: 1,
    meta: {
      throttle: true
    }
  })

  wait().then(() => {
    t.true(t.context.next.calledtwice)

    t.same(t.context.next.secondCall.args[0], {
      type: 'ACTION_TYPE',
      payload: 2,
      meta: {
        throttle: true
      }
    })
  })
})
