// backend/routes/api/users.js
const express = require('express');
const { check } = require('express-validator');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Location, Group } = require('../../db/models');
const { restoreUser } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
router.use(restoreUser)

const validateVenues=[
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longtitude is not valid'),
  handleValidationErrors
]

//Edit a Venue specified by its id ??? edit validate venue - task 13
router.put("/:id", [requireAuth, validateVenues], async (req, res, next) => {
    try {
     
      const venue = await Location.findByPk(req.params.id)
      const {
        address, 
        city, 
        state, 
        lat, 
        lng} =req.body
      if(!venue){
        next({
          message: "Venue could not be found",
          statusCode: 404
        })
      }
     
       await venue.update({
        address,
        city, 
        state, 
        latitude:lat, 
        longtitude:lng
        
      })
      console.log(venue)
      const resObj={
        id:venue.id,
        address:venue.address,
        city:venue.city, 
        state:venue.state, 
        lat:venue.latitude, 
        lng:venue.longtitude,
        "groupId": venue.groupId
      }
      res.json(
        resObj
      )
    } catch (err) {
      next(err)
    }
  }) 


module.exports = router;