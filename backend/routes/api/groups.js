const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { json } = require('sequelize');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImages, Event, Attendees, Location } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

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
    
    .withMessage("Type must be Online or In person"),
  check('capacity')
    .exists({ checkFalsy: true })
    
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

router.get("/current", [restoreUser, requireAuth], async (req, res, next) => {
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
  console.log(req.params)
  try {
    const user= req.user;
    console.log(user)
    const group = await Group.findByPk(req.params.id);
    const { url, preview} = req.body
    if (!group) {
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    if (!url) {
     next({
        status: 400,
        message: "Validation Error"
      })
    }
    const newImage = await GroupImages.create({
      url,
      preview,
      groupId:+req.params.id
    })
    res.status(201).json({
      image: newImage
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
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    const image = await GroupImages.findOne({
     where:{
      groupId:+req.params.id
     }
    })
    res.json({
      message: "Successfully deleted",
      status: 200
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
      next({
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
// router.get("/:id/membership", [restoreUser, requireAuth], async (req, res, next) => {
//   try {
//     const group = await Group.findByPk(req.params.id)
//     if(!group){
//       next({
//         message: "Group could not be found",
//         status: 404
//       })
//     }
    
//     const members = await Membership.findAll()
//     res.json({
//       "Members": members
//     })
//   } catch (err) {
//     next(err)
//   }
// })





//Create the status of a membership for a group specified by id ??? find membership - task 23
router.post("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    
    const userId= +req.user.id
    const membership = await Membership.findOne({
      where:{
        userId:userId,
        groupId:group.id
      }
    })

   if(membership && membership.dataValues.status==="pending"){
    next({
      "message": "Membership has already been requested",
      "statusCode": 400
    })
   }

   if(membership && membership.dataValues.status==="member"){
    next({
      "message": "Membership has already been requested",
      "statusCode": 400
    })
   }


    const member = await Membership.create({
      userId:+req.user.id,
      groupId:+req.params.id,
      status:"pending"
    })
    const resObj ={
      memberId:member.userId,
      status:member.status
    }
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
}) 






//Change the status of a membership for a group specified by id ??? find membership - task 23
router.put("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    const member = await Membership.update({
      status:req.body.status
    },{
      where:{
     id:+req.body.memberId
      }
    })
    const resObg = {
      "memberId": +req.body.memberId,
      "status": req.body.status
    }

    res.json(resObg)
  } catch (err) {
    next(err)
  }
}) 

//Delete membership to a group specified by id ??? find membership - task 24
router.delete("/:id/membership", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    const userId = req.user.id
    const membership = await Membership.findOne({
      where:{
        userId:userId,
        groupId:group.dataValues.id
      }
    })
    if(!membership){
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    if(membership.dataValues.status==="co-host" || membership.dataValues.status==="organaizer" || membership.dataValues.userId===userId ){
       await Membership.destroy({
        where:{
          groupId:+req.params.id
        }
      })
      res.json({
        "message": "Successfully deleted membership from group"
      })
    }
   

  
  } catch (err) {
    next(err)
  }
})

//Get all Events of a Group specified by its id - task 15
router.get("/:id/events", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include:{
        model:Event
      }
    })
    if(!group){
      next({
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

//Create an Event for a Group specified by its id ??? find events - task 17

router.post("/:id/events", [requireAuth, restoreUser, validateEvents], async (req, res, next) => {
  console.log(req.params.id)
  try {
    const group = await Group.findByPk(req.params.id)
    console.log(group)
    if(!group){
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    if(group){
      const {
        venueId,
      
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
        dateOfStart:startDate,
        dateOfEnd:endDate,
        groupId:+req.params.id,
        locationId:venueId
      })
      res.status(201).json({
        event
      })
    }
   
  } catch (err) {
    next(err)
  }
}) 


//Get All Venues for a Group specified by its id  find venue - task 11
router.get("/:id/venues", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if(!group){
      next({
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
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    console.log(lat, lng)
    const venue = await Location.create({
      address,
      city, 
      state, 
      latitude:lat, 
      longtitude:lng, 
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
  
  try {
    const group = await Group.findByPk(req.params.id)
    
    if(!group){
     next({
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

// Get details of a Group from an id - task 6 ?? does not show user
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
        attributes:["id","url"]
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
      next({
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
      next({
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

router.post("/", [requireAuth, restoreUser, validateGroups], async (req, res, next) => {
  try {
    const { name, about, type, private, city, state} = req.body
    const user = req.user
    const newGroup = await Group.create({
      name, 
      about, 
      type, 
      private, 
      city, 
      state, 
      organizerId: user.id
    })
    
    await Membership.create({
      status:"organaizer",
      userId:+req.user.id,
      groupId:newGroup.id
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