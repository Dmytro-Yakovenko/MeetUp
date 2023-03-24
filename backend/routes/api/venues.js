// backend/routes/api/users.js
const express = require("express");
const { check } = require("express-validator");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Location, Group, Membership } = require("../../db/models");
const { restoreUser } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation");
const membership = require("../../db/models/membership");
const router = express.Router();
router.use(restoreUser)

const validateVenues=[
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longtitude is not valid"),
  handleValidationErrors
]

//Edit a Venue specified by its id 
router.put("/:id", [requireAuth, validateVenues], async (req, res, next) => {
    try {
     
      const venue = await Location.findByPk(req.params.id)
    
      if(!venue){
        next({
          message: "Venue could not be found",
          statusCode: 404
        })
      }
     const group = await Group.findByPk(venue.groupId)
     const coHost = await Membership.findAll({
      where:{
        groupId:venue.groupId,
        memberId:req.user.id,
        status:"co-host"
      }
     })
     

      if(!coHost && req.user.id!==group.organizerId){
        next({
          message: "Venue can be changed by organizer",
          statusCode: 403
        })
      }
     
       await venue.update(req.body)
    
    
      const newVenue =await Location.findByPk(venue.id)
      res.json(
        newVenue
      )
    } catch (err) {
      next(err)
    }
  }) 


module.exports = router;