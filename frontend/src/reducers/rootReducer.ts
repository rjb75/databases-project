import {combineReducers} from 'redux';
import userReducer from './userReducer';
import formReducer from './formReducer';
import eventReducer from './eventReducer';

const rootReducer = combineReducers({
  user: userReducer,
  form: formReducer,
  event: eventReducer,
});

export default rootReducer;
