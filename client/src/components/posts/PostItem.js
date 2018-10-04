import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";

import { deletePost, toggleLike } from "../../actions/postActions";

class PostItem extends Component {
  onDelete(id) {
    this.props.deletePost(id);
  }
  onLike(id) {
    this.props.toggleLike(id);
  }

  checkUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { auth, post, showActions } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href={`/profile/user/${post.user}`}>
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
            {showActions ? (
              <span>
                <button
                  className="btn btn-light mr-1"
                  onClick={this.onLike.bind(this, post._id)}
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.checkUserLike(post.likes)
                    })}
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    onClick={this.onDelete.bind(this, post._id)}
                    type="button"
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" /> Delete
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: propTypes.object.isRequired,
  auth: propTypes.object.isRequired,
  deletePost: propTypes.func.isRequired,
  toggleLike: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, toggleLike }
)(PostItem);
