import api from '../utils/api';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR } from '../actions/types';

//Get Current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const userProfile = await api.get('profile/current');
    dispatch({
      type: GET_PROFILE,
      payload: userProfile.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Create or update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const userProfile = await api.post('/profile', formData);
    dispatch({
      type: GET_PROFILE,
      payload: userProfile.data,
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
