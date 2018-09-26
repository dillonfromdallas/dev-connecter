const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

const User = mongoose.model("users");
const Profile = require("../../models/profile");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noProfile = `There is no profile for this user.`;
          return res.status(404).json({ errors });
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check Validation

    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) return res.status(400).json(errors);

    const profileFields = {};
    profileFields.user = req.user.id;

    // String fields

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;

    // Skills - Split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(","); //Upgrade to something more robust.
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Check if profile exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "This user already exists.";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/exp
// @desc    Add experience to profile
// @access  Private
router.post(
  "/exp",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    //Validate
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const {
          title,
          company,
          location,
          from,
          to,
          current,
          description
        } = req.body;

        const newExp = {
          title,
          company,
          location,
          from,
          to,
          current,
          description
        };

        // Add to Experience array
        profile.experience.unshift(newExp);

        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

// @route   POST api/profile/edu
// @desc    Add education to profile
// @access  Private
router.post(
  "/edu",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Validate
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    // Add or Update

    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      };

      profile.education.unshift(newEdu);

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    });
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "Profile not found.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "Profile not found.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: "Encountered an error displaying profile." })
    );
});

// @route   GET api/profile/all
// @desc    List all profiles
// @access  Public
router.get("/all", (req, res) => {
  errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.profiles = "There are no profiles to display";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profiles: "Encountered an error displaying profiles." })
    );
});

module.exports = router;
