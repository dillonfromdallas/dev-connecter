import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import Footer from "./Footer";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing-body">
        <div className="landing">
          <div className="dark-overlay landing-inner text-light">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1 className="display-3 mb-4">Developer Connector</h1>
                  <hr />
                  <Link to="/register" className="btn btn-lg btn-info mr-2">
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn btn-lg btn-light">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 text-center text-light">
          <p className="landing-lead mb-5">
            {" "}
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <Link className="btn btn-lg btn-info mt-2" to="/profiles">
            Browse Developers
          </Link>
        </div>
        <Footer className="mt-5 mb-0" />
      </div>
    );
  }
}

Landing.PropTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
