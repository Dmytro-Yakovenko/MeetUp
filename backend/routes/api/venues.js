// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Location } = require('../../db/models');

const router = express.Router();





router.get("/", async(req, res, next)=>{
try{
const venues = await Location.findAll();
res.json({
    venues
})
}catch(e){
    next(e)
}
})





module.exports = router;