import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from './types';
import { setAlert } from './alert';

//Load User
export const loadUser = () => async (dispach) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const user = await api.get('/auth');
    dispach({
      type: USER_LOADED,
      payload: user.data,
    });
  } catch (err) {
    dispach({ type: AUTH_ERROR });
  }
};

//Register user
export const register = ({ name, email, password }) => async (dispach) => {
  const body = JSON.stringify({ name, email, password });

  try {
    const result = await api.post('/users', body);
    dispach({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispach(setAlert(error.msg, 'danger')));
    }
    dispach({
      type: REGISTER_FAIL,
    });
  }
};
