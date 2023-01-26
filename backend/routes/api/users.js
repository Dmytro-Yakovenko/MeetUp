const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true }),
  check('lastName')
    .exists({ checkFalsy: true }),
  handleValidationErrors
];

// Sign up - task 3
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const user = await User.signup({ email, username, password, firstName, lastName });
    await setTokenCookie(res, user);
    return res.json({
      user,
    });
  }
);

//Get all users
router.get("/", async (req, res, next) => {
  console.log()
  try {
    const users = await User.findAll();
    res.json({
      users
    })
  } catch {

  }
})

module.exports = router;