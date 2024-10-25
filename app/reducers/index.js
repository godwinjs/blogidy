import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import blogsReducer from './blogsReducer';
import appStateReducer from './appStateReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  form: reduxForm,
  blogs: blogsReducer,
  appState: appStateReducer
});

export default rootReducer;
