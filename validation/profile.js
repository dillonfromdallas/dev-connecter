const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 25 })) {
    errors.handle = "Handle must be between 2 and 25 characters.";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required.";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status is required.";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills are required.";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Website must be a valid URL.";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Must be a valid URL.";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Must be a valid URL.";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Must be a valid URL.";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Must be a valid URL.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
