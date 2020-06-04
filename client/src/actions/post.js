import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  CLEAR_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from '../actions/types';
// Get all posts
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
// Get Post by Id
export const getPost = (postId) => async (dispatch) => {
  try {
    const post = await api.get(`/posts/${postId}`);

    dispatch({
      type: GET_POST,
      payload: post.data,
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

// Clear Post State
export const clearPostState = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_POST,
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

//Delete post
export const deletePost = (postId) => async (dispatch) => {
  try {
    const res = await api.delete(`/posts/${postId}`);

    dispatch({ type: DELETE_POST, payload: { postId } });
    dispatch(setAlert(res.data.msg, 'success'));
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

//Add post

export const addPost = (formData) => async (dispatch) => {
  try {
    const post = await api.post('/posts', formData);

    dispatch({
      type: ADD_POST,
      payload: post.data,
    });
    dispatch(setAlert('Post created', 'success'));
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

//Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const comments = await api.post(`posts/comment/${postId}`, formData);

    dispatch({
      type: ADD_COMMENT,
      payload: comments.data,
    });
    dispatch(setAlert('Comment Added', 'success'));
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

//Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await api.delete(`posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert('Comment Removed', 'success'));
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
