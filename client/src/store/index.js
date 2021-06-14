import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rentals from './rentals/rentalsReducers';
import rental from './rental/rentalReducer';

const reducers = combineReducers({
  rentals,
  rental,
});

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
