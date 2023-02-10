// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};
// add to /backend/utils/validation.js
const env = process.env.NODE_ENV;
const schema = process.env.SCHEMA;
const sqlTable = name => env ===  "production" ? schema + `."${name[0].toUpperCase().concat(name.slice(1))}"` : name;

  module.exports = {
    handleValidationErrors,
    sqlTable
  };
// module.exports = {
//   handleValidationErrors
// };