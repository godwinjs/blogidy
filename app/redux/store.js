// redux/store.js
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
// Import the root reducer (defined below)
import rootReducer from '../reducers';
import {thunk} from 'redux-thunk';

// Create the Redux store with the root reducer
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;