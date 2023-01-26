const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { json } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImages, Event, Attendees, Location } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser)

const validateGroups = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be 60 characters or less'),
  check('about')
  .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('previewImage')
    .exists({ checkFalsy: true })
    .withMessage('imageUrl is required'),
  handleValidationErrors
];

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
    .withMessage('Longitude is not valid'),
  handleValidationErrors
]

const validateEvents = [
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Type must be Online or In person"),
  check('capacity')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price is invalid'),
    check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
    check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date must be in the future'),
      check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is less than start date'),
  handleValidationErrors
]

//In what we shoud use scope

// Get all Groups joined or organized by the Current User - task 5
router.get("/auth", [restoreUser, requireAuth], async (req, res, next) => {
  try {
    let groups = await Group.findAll({
      where: {
        organizerId: req.user.id
      }
    })
    res.json({
      groups
    })
  } catch (err) {
    next(err)
  }
})
// fetch('/api/groups/auth', {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `gUPFDtfC-1LmvPj6y7aAezkYKs75t8SmgJGg`
//   },
//  Add an Image to a Group based on the Group's id ??? create validator - task 8
// {
//   "url": "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674539956/pokerEventImages/istockphoto-1401763633-1024x1024_agcmov.webp",
//   "title":"Mother's club",
//   "preview": true
// }
router.post("/:id/images", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    const { url, preview, title } = req.body
    if (!group) {
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    if (!url || !preview || !title) {
     const err = new Error({
        status: 400,
        message: "Validation Error"
      })
    }
    const newImage = await GroupImages.create({
      url,
      preview,
      title
    })
    res.status(201).json({
      group: newImage
    })
  } catch (err) {
    next(err)
  }
})

//  Delete an Image for a Group - task 29
router.delete("/:id/images", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const image = await GroupImages.findOne({
      message: "Successfully deleted",
      status: 200
    })
    res.status(201).json({
      group: newImage
    })
  } catch (err) {
    next(err)
  }
})

//Get all Members of a Group specified by its id ??? find members - task 21
router.get("/:id/members", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const members = await Membership.findAll()
    res.json({
      "Members": members
    })
  } catch (err) {
    next(err)
  }
}) 

//Request a Membership for a Group based on the Group's id - task 22
router.get("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const members = await Membership.findAll()
    res.json({
      "Members": members
    })
  } catch (err) {
    next(err)
  }
})
//Change the status of a membership for a group specified by id ??? find membership - task 23
router.put("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const members = await Membership.findAll()
    res.json({
      "Members": members
    })
  } catch (err) {
    next(err)
  }
}) 

//Delete membership to a group specified by id ??? find membership - task 24
router.delete("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const members = await Membership.findAll()
    res.json({
      "message": "Successfully deleted membership from group"
    })
  } catch (err) {
    next(err)
  }
})

//Get all Events of a Group specified by its id ??? find events - task 15
router.get("/:id/events", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }

    res.json({
      group
    })
  } catch (err) {
    next(err)
  }
}) 

//Create an Event for a Group specified by its id ??? find events - task 15
router.post("/:id/events", [requireAuth, restoreUser, validateEvents], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const {
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    } = req.body
    const event = await Event.create({
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    })
    res.json({
      event
    })
  } catch (err) {
    next(err)
  }
}) 


//Get All Venues for a Group specified by its id  find venue - task 11
router.get("/:id/venues", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const venues = await Location.findAll({
      where:{
        groupId:req.params.id
      }
    })
    res.json({
      venues
    })
  } catch (err) {
    next(err)
  }
})
//Create a new Venue for a Group specified by its id  create validate venue - task 12
router.post("/:id/venues", [requireAuth, restoreUser, validateVenues], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    const {
      address, 
      city, 
      state, 
      lat, 
      lng} =req.body
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    const venue = await Location.create({
      address,
      city, 
      state, 
      latitude:lat, 
      longitude:lng, 
      groupId:req.params.id})
    res.json({
      venue
    })
  } catch (err) {
    next(err)
  }
}) 


//Edit a Group - task 9
router.put("/:id", [requireAuth, restoreUser, validateGroups], async (req, res, next) => {
  console.log(req.params.id)
  try {
    const group = await Group.findByPk(req.params.id)
    
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    await group.update(req.body)
     await group.save()
    res.json({
      group
    })
  } catch (err) {
    next(err)
  }
}) 

// Get details of a Group from an id - task 6 
router.get("/:id", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id,{
      include:[
       {
        model:User,
        attributes:["lastName", "firstName","id"]
       },
       {
        model:GroupImages,
        attributes:["id","url","title"]
       },
       {
        model:Location,
        attributes:[  
          "id",
        "groupId",
        "address",
        "city",
        "state",
        "latitude",
        "longtitude"
      ]
       }
      ],
     
    }
      )
    if (!group) {
      const err = new Error({
        status: 404,
        message: `Could not find group ${req.params.id}`
      })
    }
    // const user = await User.findB
    res.json({
      group
    })
  } catch (err) {
    next(err)
  }
})

//Delete a Group - task 10
router.delete("/:id", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      const err = new Error({
        message: "Group could not be found",
        status: 404
      })
    }
    await group.destroy()
    res.json(  {
      "message": "Successfully deleted",
      status: 200
    })
  } catch (err) {
    next(err)
  }
}) 

// Create a Group  - task 7
// {
//   "name" : "Bay Area Office Yogis Meetup Group",
//   "about": "If you like to network with like-minded people in a chill and energizing yoga class, join our Bay Area Office Yoga group and explore your mind, body, and soul potential through mindfulness practice",
//   "type": "inPerson",
//    "private":"false",
//     "city": "San Francisco", 
//     "state":"California",  
//     "organizerId":4, 
//     "previewImage" : "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674487799/pokerEventImages/istockphoto-1355684130-1024x1024_gadbme.webp"
// }
router.post("/", [requireAuth, restoreUser, validateGroups], async (req, res, next) => {
  try {
    const { name, about, type, private, city, state, previewImage } = req.body
    const user = req.user
    const newGroup = await Group.create({
      name, 
      about, 
      type, 
      private, 
      city, 
      state, 
      previewImage,
      organizerId: user.id
    })
    res.json({
      group: newGroup
    })
  } catch (err) {
    next(err)
  }
})

//Get all Groups - task 4
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll()
    res.json({
      groups
    })
    return;
  } catch (err) {
    next(err)
  }
  return
})

module.exports = router;