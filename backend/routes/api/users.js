const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");

// ...

// backend/routes/api/users.js


const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username")
    .not()
    .isEmail()
    .withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true }),
  check("lastName")
    .exists({ checkFalsy: true }),
  handleValidationErrors
];

// Sign up - task 3
router.post(
  "/",
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
const userByEmail = await User.findOne({
  where:{
    email
  }
})
if(userByEmail){
  next(  {
    "message": "User already exists",
    "statusCode": 403,
    status:403,
    "errors": [
      "User with that email already exists",
    
    ]
  })
}
const userByUsername = await User.findOne({
  where:{
    username
  }
})
if(userByUsername){
  next(  {
    "message": "User already exists",
    "statusCode": 403,
    status:403,
    "errors": [
      "User with that username already exists"
    ]
  })
}

    const user = await User.signup({ email, username, password, firstName, lastName });

   const token = await setTokenCookie(res, user);
   const csrfToken = req.csrfToken();
   res.cookie("XSRF-TOKEN", csrfToken);
   const userResponse={
    id:user.id,
    firstName,
    lastName, 
    username,
    email, 
    token:csrfToken 
   }
   return res.json(
     userResponse
   )
  
  }
);



// Get current User 

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.scope("currentUser").findByPk(req.params.id)
 
    if (!user) {
      next({
        status: 404,
        message: "Could not find user",
        details: `User ${req.params.id} not found`,
      });
      return;
      }
      const csrfToken = req.csrfToken();
      res.cookie("XSRF-TOKEN", csrfToken);
      return res.json({
        user,
        "XSRF-Token": csrfToken
      })
    }catch(err){
      next({        
        status: 404,
        message: `Could not find user ${req.params.id}`    
      })
    }
  });

module.exports = router;
