import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";

class PostItem extends Component {
  onDelete(id) {
    console.log(id);
  }
  render() {
    const { auth, post } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="/profile">
              <img
                src={post.avatar}
                alt={post.name}
                className="rounded-circle d-none d-md-block"
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            <button className="btn btn-light mr-1">
              <i className="text-info fas fa-thumbs-up" />
              <span className="badge badge-light">{post.likes.length}</span>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
              Comments
            </Link>
            {post.user === auth.user.id ? (
              <button
                onClick={this.onDelete.bind(this, post.id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fas fa-times" /> Delete
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.propTypes = {
  post: propTypes.object.isRequired,
  auth: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(PostItem);
