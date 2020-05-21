const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Post = require('../../models/Posts');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const erorrs = validationResult(req);
    if (!erorrs.isEmpty()) {
      return res.status(400).json({ errors: erorrs.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }

    res.send('Posts route');
  }
);

// @route GET api/posts
// @desc get all post
// @access Priavte

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route GEt api/posts/:id
// @desc get post by id
// @access Priavte

router.get('/:id', auth, async (req, res) => {
  try {
    let post = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id);
    }

    if (!post) {
      return res.status(400).send('Post not found!');
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Post not found!');
    }
    return res.status(500).send('Server error');
  }
});

// @route DELETE api/posts/:id
// @desc delete post by id
// @access Priavte

router.delete('/:id', auth, async (req, res) => {
  try {
    let post = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id);
    }

    if (!post) {
      return res.status(400).send('Post not found!');
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Post not found!');
    }
    return res.status(500).send('Server error');
  }
});

// @route PUT api/posts/like/:id
// @desc like a post
// @access Priavte

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).send('Post not found!');
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Post not found!');
    }
    return res.status(500).send('Server error');
  }
});

// @route PUT api/posts/unlike/:id
// @desc unlike a post
// @access Priavte

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).send('Post not found!');
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has no like by current user' });
    }
    const removedIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removedIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Post not found!');
    }
    return res.status(500).send('Server error');
  }
});

// @route POST api/posts/comment/:id
// @desc Comment on a post
// @access Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const erorrs = validationResult(req);
    if (!erorrs.isEmpty()) {
      return res.status(400).json({ errors: erorrs.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }

    res.send('Posts route');
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment
// @access Priavte

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    let post = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id);
    }

    if (!post) {
      return res.status(400).send('Post not found!');
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exists' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removedIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removedIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Post not found!');
    }
    return res.status(500).send('Server error');
  }
});

module.exports = router;
