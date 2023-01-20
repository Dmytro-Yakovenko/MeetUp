// backend/routes/api/groups.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group } = require("../../db/models");
const { json } = require('sequelize');
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll()
    console.log(groups)
    res.json({
      groups
    })

    return;


  } catch (err) {
    console.log(err)

  }
  return

})


module.exports = router;