import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from '../actions/types';

const initialState = {
  posts: [],
  post: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        //post: null,
        loading: false,
        error: payload,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    default:
      return state;
  }
}
