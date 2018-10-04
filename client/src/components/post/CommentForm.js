import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";

import { addComment } from "../../actions/postActions";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";

const placeholders = [
  "What's cookin' good lookin'?",
  "Despite the constant negative press covfefe",
  "Did ya hear about the new frontend JS framework?",
  "[Insert rant about how underrated Rust is]",
  "Tab is just a capital Space",
  "Hello World!",
  "git push origin master"
];

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {}
    };
    this.choosePlaceholder = this.choosePlaceholder.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.errors) {
      return { errors: nextProps.errors };
    }
  }

  choosePlaceholder() {
    const phrase =
      placeholders[Math.floor(Math.random() * placeholders.length)];
    return phrase;
  }

  onSubmit(e) {
    e.preventDefault();

    const { postId } = this.props;
    const { user } = this.props.auth;

    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addComment(postId, newComment);
    this.setState({ text: "" });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const randomPlaceholder = this.choosePlaceholder();
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white text-center">
            Add a Comment
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder={randomPlaceholder}
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button className="btn btn-dark">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  addComment: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  errors: propTypes.object.isRequired,
  postId: propTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addComment }
)(CommentForm);
