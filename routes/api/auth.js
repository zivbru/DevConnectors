const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
// @route GET api/auth
// @desc Test Route
// @acess Public
router.get('/', auth, async (req, res) => {
  try {
    //get the user by id but without the password param
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
