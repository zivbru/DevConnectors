import api from '../utils/api';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from '../actions/types';

export const getPosts = () => async (dispatch) => {
  try {
    const posts = await api.get('/posts');

    dispatch({
      type: GET_POSTS,
      payload: posts.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Add likes
export const addLike = (postId) => async (dispatch) => {
  try {
    const likes = await api.put(`/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: likes.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Remove like
export const removeLike = (postId) => async (dispatch) => {
  try {
    const likes = await api.put(`/posts/unlike/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: likes.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
