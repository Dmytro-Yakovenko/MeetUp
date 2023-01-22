const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Event} = require('../../db/models');

const router = express.Router();
 router.get("/", async(req,res,next)=>{
    
    try{
      const events = await Event.findAll();
      res.json({
         events
      })
    }catch(e){
      next(e)
    }
    
 })

 module.exports = router;