import {USER_LOGGED_IN, USER_SIGNED_OUT} from '../actions/userActions/userTypes';
import LoginResponse from '../models/LoginResponse';

interface UserState {
  data: LoginResponse;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: UserState = {
  data: null,
};

const userReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        data: action.payload,
      };
    case USER_SIGNED_OUT:
      return {
        ...state,
        data: null,
      };
    default:
      return state;
  }
};

export default userReducer;
