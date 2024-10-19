import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import blogsReducer from './blogsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  form: reduxForm,
  blogs: blogsReducer
});

export default rootReducer;
