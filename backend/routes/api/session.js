// backend/routes/api/session.js
const express = require("express");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

// backend/routes/api/session.js
// ...

// backend/routes/api/session.js
// ...
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// ...

// Log in
router.post(
  "/",
  async (req, res, next) => {
    const { credential, password } = req.body;
    if (!credential || !password) {
      next({
      
          "message": "Validation error",
          "statusCode": 400,
          "errors": [
            "Email is required",
            "Password is required"
          ]
        
    }
    )
  }
const user = await User.login({ credential, password });

if (!user) {

  return next({
    "message": "Invalid credentials",
    "statusCode": 401
  });
}

await setTokenCookie(res, user);

const csrfToken = req.csrfToken();
res.cookie("XSRF-TOKEN", csrfToken);
const userResponse = {
 
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    token: csrfToken
  
}
return res.json(
  userResponse
)
    
       }
  );

// backend/routes/api/session.js
// ...

// Log out
router.delete(
  "/",
  (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "success" });
  }
);

// ...
// backend/routes/api/session.js
// ...

// Restore session user
router.get(
  "/",
  restoreUser,
  (req, res) => {
    const { user } = req;

    if (user) {
      return res.json({
        user: user
      });
    } else return res.json({});
  }
);

// ...
// backend/routes/api/session.js
// ...
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

// Log in


// router.post(
//   "/",
//   validateLogin,
//   async (req, res, next) => {
//     const { credential, password } = req.body;

//     const user = await User.login({ credential, password });

//     if (!user) {
//       const err = new Error("Login failed");
//       err.status = 401;
//       err.title = "Login failed";
//       err.errors = ["The provided credentials were invalid."];
//       return next(err);
//     }

//     await setTokenCookie(res, user);

//     return res.json(
//       user
//     );
//   }
// );
router.get(
  '/',
  restoreUser,
  (req, res, next) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } 
    const err = new Error("Authentication required")
    err.status = 401
    return next(err);
  }
);

// backend/routes/api/session.js
// ...


// backend/routes/api/session.js
// ...


module.exports = router;