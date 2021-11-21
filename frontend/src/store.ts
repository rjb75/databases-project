import { createStore } from 'redux';
import { testReducer } from './reducers/testReducer';

export const store = createStore(testReducer);