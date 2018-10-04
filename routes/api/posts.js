const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Validator = require("validator");

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
    Post.find({ user: req.user.id })
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
      if (!post.user === req.user.id) {
        errors.perm = "You cannot edit someone else's post.";
        return res.status(401).json(errors);
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
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ identityTheft: `You can't delete another user's posts!` });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(400).json(err));
  }
);

// ~~~ Likes and Comments ~~~
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
          // If user doesn't already like post, add like
          post.likes.push({ user: req.user.id });
        } else {
          // Otherwise, remove like
          post.likes.splice(index, 1);
        }
        post
          .save()
          .then(post => {
            res.status(200).json(post);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/posts/comment/:postId
// @desc    Add a comment to a post
// @access  Private
router.post(
  "/comment/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.postId).then(post => {
      if (!post) {
        res.status(404).json({ postNotFound: "No post found." });
      }

      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      post
        .save()
        .then(res.json(post))
        .catch(err => res.statur(404).json(err));
    });
  }
);

// @route   DELETE api/posts/comment/:postId/:commentId
// @desc    Delete a comment from a post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
