const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

// @route   POST api/posts
// @desc    Create a post!
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPosts: "No posts found!" }));
});

// @route   GET api/posts/mine
// @desc    Show all posts you've made
// @access  Private
router.get(
  "/mine",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user })
      .then(posts => {
        res.json(posts);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/posts/:postId
// @desc    Get an individual post
// @access  Private
router.get("/:postId", (req, res) => {
  Post.findById(req.params.postId)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPost: "No post found!" }));
});

// @route   POST api/posts/:postId
// @desc    Update a post
// @access  Private
router.post(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.postId).then(post => {
      if (!post.user === req.user) {
        errors.perm = "You cannot edit someone else's post.";
        return res.status(400).json(errors);
      }
      post.text = req.body.text;
      post.save().then(res.json(post));
    });
  }
);

// @route   DELETE api/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then(post => {
        if (post.user === req.user) {
          res.json({ success: true });
        } else {
          res
            .status(404)
            .json({ identityTheft: "You can't delete someone else's posts." });
        }
      })
      .catch(err =>
        res.status(404).json({
          postNotFound: "Could not find the post. Maybe it's already deleted!"
        })
      );
  }
);

// ~~~ Likes ~~~
// @route   POST api/posts/like/:postId
// @desc    Like a post
// @access  Private
router.post(
  "/like/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then(post => {
        if (!post) res.status(404).json({ postNotFound: "No post found." });

        //Check if user already liked
        const index = post.likes.findIndex(value => {
          return value.user == req.user.id;
        });
        if (index === -1) {
          post.likes.push({ user: req.user.id });
        } else {
          post.likes.splice(index, 1);
        }
        post
          .save()
          .then(post => {
            res.status(200).json(post);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
