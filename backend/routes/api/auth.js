const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors
];

// Log in - task 2
router.post(
  "/",
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;
    if(!credential || !password){
        const err = new Error("Invalid credentials");
        err.status = 401;
        err.title = "Login failed";
        err.message="Invalid credentials"
        return next(err); 
    }
    const user = await User.login({ credential, password });
    if (!user) {
      const err = new Error("Validation error");
      err.status = 400;
      err.title = "Login failed";
      err.message="Validation error"
      err.errors = ["Email is required", "Password is required"];
      return next(err);
    }
    const token = await setTokenCookie(res, user);
    const csrfToken = req.csrfToken();
      res.cookie("XSRF-TOKEN", csrfToken);
      const userResponse = {user:{
        id:user.id,
        firstName,
        lastName, 
        username,
        email, 
        token:csrfToken 
       }}
       return res.json(
         userResponse
       )
  
  }
);

// Log out
router.delete(
  "/",
  (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "success" });
  }
);

// Restore session user - task 1
router.get(
  "/",
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
);

module.exports = router;