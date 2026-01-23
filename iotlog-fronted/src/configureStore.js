import { applyMiddleware, compose, createStore } from 'redux'
import { thunk } from 'redux-thunk'
import monitorReducersEnhancer from './components/Redux/enhancers/monitorReducer'
import loggerMiddleware from './components/Redux/middleware/logger'
import { Reducers } from './reducers'

function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunk]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)
  const store = createStore(Reducers, preloadedState, composedEnhancers)
  return store;
}

export const Store = configureStore();
