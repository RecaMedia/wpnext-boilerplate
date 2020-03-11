import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import asyncDispatch from './async-dispatch';
import defaultState from './state';
import reducers from './reducer';

const logger = createLogger({
  level: 'log'
});

const middleware = applyMiddleware(asyncDispatch, logger);

const store = createStore(reducers, defaultState, middleware);

export default store;