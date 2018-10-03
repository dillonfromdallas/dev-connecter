import React, { Component } from "react";
import propTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    const firstName = profile.user.name.trim().split(" ")[0];

    const skills = profile.skills
      .filter(skill => skill !== "")
      .map((skill, index) => (
        <div className="p-3" key={index}>
          <i className="fa fa-check" /> {skill}
        </div>
      ));

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">
              {firstName}
              's Bio
            </h3>
            <p className="lead">
              {isEmpty(profile.bio) ? (
                <span>{firstName} hasn't added a Bio yet.</span>
              ) : (
                <span>{profile.bio}</span>
              )}
            </p>
            <hr />
            <h3>Skills</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileAbout;
