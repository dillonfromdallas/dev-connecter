import React, { Component } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import {
  createUserProfile,
  getCurrentProfile
} from "../../actions/profileActions";
import { withRouter } from "react-router-dom";
import isEmpty from "../../validation/isEmpty";

const ObjectMapper = (sourceType, destinationType) => {
  const destinationTypeOutput = {};
  Object.entries(sourceType).forEach(([key, value]) => {
    if (destinationType.hasOwnProperty(key)) {
      if (value) {
        destinationTypeOutput[key] = value;
      }
    }
  });
  return destinationTypeOutput;
};

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    displaySocialInput: false,
    handle: "",
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubUsername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    github: "",
    instagram: ""
  };

  fillProfileState = profile => {
    const { skills, social } = profile;
    const skillsToFill = skills ? skills.join(",") : "";
    const socialsToFill = social ? ObjectMapper(social, this.state) : {};
    const profileToFill = {
      ...ObjectMapper(profile, this.state),
      ...socialsToFill,
      skills: skillsToFill
    };
    this.setState({
      ...this.state,
      ...profileToFill
    });
  };

  componentDidMount() {
    const {
      profile: { profile }
    } = this.props;
    // Read profile from redux store
    // if it has profile fill the form.
    // normal form filing case
    if (!isEmpty(profile)) {
      this.fillProfileState(profile);
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.errors) {
      return { errors: nextProps.errors };
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.createUserProfile(profileData, this.props.history);
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Your Twitter URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Your Facebook URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Your LinkedIn URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="Your YouTube URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
        </div>
      );
    }

    // Options for status
    const options = [
      {
        label: "*Select Professional Status",
        value: "0"
      },
      {
        label: "Delevoper",
        value: "Developer"
      },
      {
        label: "Manager",
        value: "Manager"
      },
      {
        label: "Student (or learning)",
        value: "Student"
      },
      {
        label: "Instructor",
        value: "Instructor"
      },
      {
        label: "Intern",
        value: "Intern"
      },
      {
        label: "Technical Founder",
        value: "Technical Founder"
      },
      {
        label: "Non-Technical Founder",
        value: "Non-Technical Founder"
      },
      {
        label: "Other",
        value: "Other"
      }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Edit Profile</h1>
              <small className="d-block pb-3 text-center">
                * required fields
              </small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Username"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL. (ex. cooldev2019) This can be changed later."
                />

                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  error={errors.status}
                  options={options}
                  info="Where are you at in your career?"
                />

                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="The name of your startup, or current company you work for. (Or just Freelance if you're a lone wolf!)"
                />

                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Could be yours or your company's."
                />

                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="What city are you from?"
                />

                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Please use comma-separated values. (E.g. HTML,CSS,JavaScript,React)"
                />

                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubUsername"
                  value={this.state.githubUsername}
                  onChange={this.onChange}
                  error={errors.githubUsername}
                  info="If you want to display your latest github repos, and a link to your profile."
                />

                <TextAreaFieldGroup
                  placeholder="About You"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself! What hobbies do you have? What are you scared of? What's your perfect cup of coffee?"
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-primary"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted"> Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mtt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  profile: propTypes.object.isRequired,
  errors: propTypes.object.isRequired,
  createUserProfile: propTypes.func.isRequired,
  getCurrentProfile: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createUserProfile, getCurrentProfile }
)(withRouter(EditProfile));
