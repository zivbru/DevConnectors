const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const config = require('config');

// @route GET api/auth
// @desc Test Route
// @access Public
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

// @route POST api/auth
// @desc  Authenticate user & get token
// @access Public

router.post(
  '/',
  [
    // validations of user props
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required!').exists(),
  ],
  async (req, res) => {
    // check if there is errors from props validations
    const erorrs = validationResult(req);
    if (!erorrs.isEmpty()) {
      return res.status(400).json({ errors: erorrs.array() });
    }

    const { email, password } = req.body;
    try {
      // check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }

      // create a token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
