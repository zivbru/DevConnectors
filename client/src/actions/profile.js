import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_ALL_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  LOGOUT,
} from '../actions/types';

//Get Current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const userProfile = await api.get('profile/current');
    dispatch({
      type: GET_PROFILE,
      payload: userProfile.data,
    });
  } catch (error) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Get All Profiles
export const getAllProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const allProfile = await api.get('/profile');
    dispatch({
      type: GET_ALL_PROFILES,
      payload: allProfile.data,
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

// Get Profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const userProfile = await api.get(`profile/user/${userId}`);
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

// Get Github Repos
export const getGithubRepos = (githubUserName) => async (dispatch) => {
  try {
    const githubRepos = await api.get(`profile/github/${githubUserName}`);
    dispatch({
      type: GET_REPOS,
      payload: githubRepos.data,
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

//Add experience

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const userProfile = await api.put('/profile/experience', formData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: userProfile.data,
    });

    dispatch(setAlert('Experience added', 'success'));

    history.push('/dashboard');
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

//Add education

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const userProfile = await api.put('/profile/education', formData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: userProfile.data,
    });

    dispatch(setAlert('Education added', 'success'));

    history.push('/dashboard');
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

// Delete Experience

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const userProfile = await api.delete(`/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: userProfile.data,
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (error) {
    console.error(error);
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// delete Education

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const userProfile = await api.delete(`/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: userProfile.data,
    });

    dispatch(setAlert('Education Removed', 'success'));
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

// delete Account and profile

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can Not be undone ')) {
    try {
      await api.delete(`/profile`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch({ type: LOGOUT });

      dispatch(setAlert('Your account has been deleted!'));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};
