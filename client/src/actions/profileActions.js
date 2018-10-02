import axios from "axios";

import { logoutUser } from "./authActions";
import {
  GET_PROFILE,
  GET_ERRORS,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        // Returns empty profile if user has not created one.
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Create profile
export const createUserProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post("/api/profile/exp", expData)
    .then(res => {
      history.push("/dashboard");
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

// Delete Acct. & Profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Delete your account? This action CANNOT be undone.")) {
    axios
      .delete("/api/profile")
      .then(res => {
        dispatch(logoutUser());
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
