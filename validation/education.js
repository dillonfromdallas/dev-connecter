const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "Must provide a school name.";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Must provide a degree or course name.";
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = "Must provide a field of study.";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "Must provide a start date.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
