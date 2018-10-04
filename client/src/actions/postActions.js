import axios from "axios";
import {
  ADD_POST,
  DELETE_POST,
  GET_ERRORS,
  GET_POST,
  GET_POSTS,
  POST_LOADING,
  TOGGLE_LIKE
} from "./types";

// Add Post
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

// Get all posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_POSTS, payload: null }));
};

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

// Delete a post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(({ data }) =>
      dispatch({
        type: DELETE_POST,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Toggle the Like on a post
export const toggleLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(({ data }) =>
      dispatch({
        type: TOGGLE_LIKE,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get individual post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_POST, payload: null }));
};

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
