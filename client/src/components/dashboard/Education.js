import React, { Component } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import Moment from "react-moment";

import { deleteEducation } from "../../actions/profileActions";

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const data = this.props.data.map(exp => (
      <tr key={exp._id}>
        <td>{exp.school}</td>
        <td>{exp.degree}</td>
        <td>
          <Moment format="MM/DD/YYYY">{exp.from}</Moment> -{" "}
          {exp.to === null ? (
            "Current"
          ) : (
            <Moment format="MM/DD/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education</h4>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Time</th>
              <th />
            </tr>
            {data}
          </thead>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: propTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
