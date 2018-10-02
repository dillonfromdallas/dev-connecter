import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const InputGroup = ({
  error,
  name,
  onChange,
  placeholder,
  title,
  value,
  icon,
  type
}) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={icon} />
        </span>
      </div>
      <input
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        title={title}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputGroup.PropTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.string
};

InputGroup.defaultProps = {
  type: "text"
};

export default InputGroup;
