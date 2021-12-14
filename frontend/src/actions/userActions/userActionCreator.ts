import { USER_LOGGED_IN, USER_SIGNED_OUT} from './userTypes';
import LoginResponse from '../../models/LoginResponse';

export const usersLoggedIn = (data: LoginResponse) => ({
  type: USER_LOGGED_IN,
  payload: data,
});

export const userSignedOut = () => ({
  type: USER_SIGNED_OUT,
});