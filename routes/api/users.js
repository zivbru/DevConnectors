const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const config = require('config');

// @route POST api/users
// @desc Register user
// @access Public

router.post(
  '/',
  [
    // validations of user props
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength(6),
  ],
  async (req, res) => {
    // check is there is errors from props validations
    const erorrs = validationResult(req);
    if (!erorrs.isEmpty()) {
      return res.status(400).json({ errors: erorrs.array() });
    }
    const { name, email, password } = req.body;
    try {
      // check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User email already exists',
              param: 'email',
              location: 'body',
            },
          ],
        });
      }
      // get the user img by mail
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // create the user

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save user to db
      user.save();

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
