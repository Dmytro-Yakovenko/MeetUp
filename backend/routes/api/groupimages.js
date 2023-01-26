const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Event} = require('../../db/models');

const router = express.Router();








module.exports = router;