import React, { Component } from "react";
import propTypes from "prop-types";

import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments, postId } = this.props;
    return comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={postId} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: propTypes.array.isRequired,
  postId: propTypes.string.isRequired
};

const mapStateToProps = state => ({
  comments: state.comments,
  postId: state.postId
});

export default CommentFeed;
