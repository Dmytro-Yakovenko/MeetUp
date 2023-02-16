const express = require('express');
const router = express.Router();
const { check } = require('express-validator');



const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Event, Location, EventImage } = require('../../db/models');
const { handleValidationErrors} = require('../../utils/validation');

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
    .isIn(['On line', 'In person'])
    .withMessage("Type must be 'Online' or 'InPerson'"),
  check('private')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage('State is required'),
  handleValidationErrors
];

const validateVenues = [
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
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage("Type must be Online or In person"),
  check('capacity')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    // .isCurrency()
    .withMessage('Price is invalid'),

  check('description')
    .exists({ checkFalsy: true })
    .isLength({ min: 15 })
    .withMessage('Description is required'),
  check('startDate')
    .exists({ checkFalsy: true })
    // .isDate()
    // .isAfter(new Date())
    .withMessage('Start date must be in the future'),
  check('endDate')
    .exists({ checkFalsy: true })
    // .isDate()
    // .isAfter("dateOfStart")
    .withMessage('End date is less than start date'),
  handleValidationErrors

]

// Get all Groups joined or organized by the Current User Task-5

router.get("/current", requireAuth, async (req, res, next) => {
  try {
    let groups = await Group.findAll({
      where: {
        organizerId: req.user.id
      },
      include: {
        model: GroupImage,
        attributes: ["preview", "url"]
      }
    })

    const list = []
    groups.forEach(group => {
      list.push(group.toJSON())
    })
    list.forEach(item => {
      item.GroupImages.forEach(image => {
        if (image.preview === true) {
          item.previewImage = image.url
        }
      })
      if (!item.previewImage) {
        item.previewImage = 'no photo added'
      }

      delete item.GroupImages

    })
    res.json(
      {
        Groups:list
      }
      

    )
  } catch (err) {
    next(err)
  }
})





// // Get all Groups joined or organized by the Current User - task 5
// router.get("/auth", requireAuth, async (req, res, next) => {
//   try {
//     let groups = await Group.findAll({
//       where: {
//         organizerId: req.user.id
//       }
//     })
//     res.json(
//       groups
//     )
//   } catch (err) {
//     next(err)
//   }
// })
//Add an Image to a Group based on the Group's id  Task-8
router.post("/:id/images", requireAuth, async (req, res, next) => {

  try {
    const group = await Group.findByPk(req.params.id);
    const { url, preview } = req.body
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    if (!url && preview) {
      next({
        statusCode: 400,
        message: "Validation Error"
      })
    }
    const image = await GroupImage.create({
      url,
      preview,
      groupId: +req.params.id
    })
    const resObj = {
      "id": image.id,
      "url": image.url,
      "preview": image.preview
    }
    res.status(201).json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})

// // //  Delete an Image for a Group - task 29
// // router.delete("/:id/images", requireAuth, async (req, res, next) => {
// //   try {
// //     const group = await Group.findByPk(req.params.id);
// //     if (!group) {
// //       next({
// //         message: "Group could not be found",
// //         status: 404
// //       })
// //     }
// //      await GroupImage.destroy({
// //      where:{
// //       groupId:+req.params.id
// //      }
// //     })
// //     res.json({
// //       message: "Successfully deleted",
// //       status: 200
// //     })
// //   } catch (err) {
// //     next(err)
// //   }
// // })

// //Get all Members of a Group specified by its id ??? find members - task 21
// router.get("/:id/members", [requireAuth, restoreUser], async (req, res, next) => {
//   try {
//     const group = await Group.findByPk(req.params.id)
//     if (!group) {
//       next({
//         message: "Group could not be found",
//         statusCode: 404
//       })
//     }
//     const members = await Membership.findAll()
//     res.json(
//       members
//     )
//   } catch (err) {
//     next(err)
//   }
// })

// //Request a Membership for a Group based on the Group's id - task 22
// // router.get("/:id/membership", [restoreUser, requireAuth], async (req, res, next) => {
// //   try {
// //     const group = await Group.findByPk(req.params.id)
// //     if(!group){
// //       next({
// //         message: "Group could not be found",
// //         status: 404
// //       })
// //     }

// //     const members = await Membership.findAll()
// //     res.json({
// //       "Members": members
// //     })
// //   } catch (err) {
// //     next(err)
// //   }
// // })





// //Create the status of a membership for a group specified by id ??? find membership - task 23
// router.post("/:id/membership", requireAuth, async (req, res, next) => {
//   try {

//     const group = await Group.findByPk(+req.params.id)
//     if (!group) {
//       next({
//         message: "Group could not be found",
//         statusCode: 404
//       })
//     }

//     const userId = +req.user.id
//     const user = await User.findByPk(userId)

//     // const membership = await Membership.findOne({
//     //   where: {
//     //     userId: userId,
//     //     groupId: group.id
//     //   }
//     // })

//     // if (membership && membership.dataValues.status === "pending") {
//     //   next({
//     //     "message": "Membership has already been requested",
//     //     "statusCode": 400
//     //   })
//     // }

//     // if (membership && membership.dataValues.status === "member") {
//     //   next({
//     //     "message": "Membership has already been requested",
//     //     "statusCode": 400
//     //   })
//     // }


//     // const member = await Membership.create({
//     //   userId: +req.user.id,
//     //   groupId: +req.params.id,
//     //   status: "pending"
//     // })
//     // const musician = await Musician.findByPk(req.params.musicianId);
//     //     const { instrumentIds } = req.body;

//     //     await musician.addInstruments(instrumentIds);
//     console.log(user)



//     const member = await user.addGroups(+req.params.id)
//     console.log(member)
//     const membership = await Membership.findOne(


//       {
//         where: {
//           userId: userId
//         },
//       }


//     )
//     membership.update(
//       { status: req.body.status, userId: userId, groupId: +req.params.id }
//     )
//     // const resObj = {
//     //   memberId: member.userId,
//     //   status: member.status,
//     //   groupId: member.groupId
//     // }
//     res.status(201).json(
//       membership
//     )
//   } catch (err) {
//     next(err)
//   }
// })






// //Change the status of a membership for a group specified by id ??? find membership - task 23
// router.put("/:id/membership", requireAuth, async (req, res, next) => {
//   try {
//     const group = await Group.findByPk(req.params.id)
//     if (!group) {
//       next({
//         message: "Group could not be found",
//         statusCode: 404
//       })
//     }
//     const member = await Membership.findOne({
//       where: {
//         // groupId: group.id,
//         userId: +req.user.id
//       }
//     })
//     // console.log(member)
//     // if (!member) {
//     //   next({
//     //     message: "request to join group not found",
//     //     statusCode: 404
//     //   })
//     // }
//     // member.update({
//     //   status: req.body.status
//     // }
//     // )

//     // const resObg = {
//     //   "id": member.id,
//     //   "groupId": member.groupId,
//     //   "memberId": member.userId,
//     //   "status": member.status
//     // }
//     console.log(member)
//     // res.json(resObg)
//     // const status = member.dataValues.status

//     //if (status === "organaizer" || status === "co-host") {
//     const membership = await Membership.update({
//       userId: req.body.memberId,
//       groupId: +req.params.id,
//       status: req.body.status
//     }, {
//       where: {
//         groupId: +req.params.id
//       }
//     })

//     const resObg = {
//       userId: req.body.memberId,
//       eventId: +req.params.id,
//       id: membership.id,

//       status: req.body.status
//     }
//     res.json(
//       resObg
//     )
//     // }else {
//     //   next({
//     //     statusCode: 403,
//     //     message: "you can not change it"

//     //   })
//     //}
//   } catch (err) {
//     next(err)
//   }
// })

// //Delete membership to a group specified by id ??? find membership - task 24
// router.delete("/:id/membership", requireAuth, async (req, res, next) => {
//   try {
//     const group = await Group.findByPk(req.params.id)
//     if (!group) {
//       next({
//         message: "Group could not be found",
//         statusCode: 404
//       })
//     }
//     const userId = req.user.id
//     const membership = await Membership.findOne({
//       where: {
//         userId: userId,
//         groupId: group.dataValues.id
//       }
//     })
//     if (!membership) {
//       next({
//         message: "Group could not be found",
//         status: 404
//       })
//     }
//     if (membership.dataValues.status === "co-host" || membership.dataValues.status === "organaizer" || membership.dataValues.userId === userId) {
//       await Membership.destroy({
//         where: {
//           groupId: +req.params.id
//         }
//       })
//       res.json({
//         "message": "Successfully deleted membership from group"
//       })
//     }


//   } catch (err) {
//     next(err)
//   }
// })

// //(???? num attendees) Get all Events of a Group specified by its id - task 15
router.get("/:id/events", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const events = await Event.findAll({
      where: {
        groupId: req.params.id
      },
      include: [
        {
          model: Group,
          attributes: [
            "id",
            "name",
        
            "city",
            "state"
          ]
        },
        {
          model: Location,
          attributes: [
            "id",
            "city",
            "state"
          ]
        },
        {
          model: EventImage,
          attributes: [
          'id',
            "url",
            "preview"
          ]
        }
      ]
    });

   
    const list = []
    events.forEach(event => {
      list.push(event.toJSON())
    })
    list.forEach(item => {
      item.EventImages.forEach(image => {
        console.log(image)
        if (image.preview) {
          
          item.previewImage = image.url
        }
      })
      if (!item.previewImage) {
        item.previewImage = 'no photo added'
      }
      if(item.locationId){
        item.venueId=item.locationId
        item.Venue=item.Location
      }
if(!item.locationId){
  item.venueId=null
  item.Venue=null
}


      delete item.EventImages
      delete item.Location
      delete item.createdAt
      delete item.updatedAt
      delete item.locationId
      delete item.price
      delete item.capacity
      delete item.description
    })

    



    res.json({
      Events:list
    }
     
    )
  } catch (err) {
    next(err)
  }
})

// //Create an Event for a Group specified by its id ??? find events - task 17

router.post("/:id/events", [requireAuth, validateEvents], async (req, res, next) => {

  try {
    const group = await Group.findByPk(req.params.id)

    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    if (group) {
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
         startDate,
         endDate,
        groupId: +req.params.id,
        locationId: venueId
      })
      const resObg = {
        "id": event.id,
        "groupId": event.groupId,
        "venueId": event.locationId,
        "name": event.name,
        "type": event.type,
        "capacity": event.capacity,
        "price": event.price,
        "description": event.description,
        "startDate": event.startDate,
        "endDate": event.endDate
      }
      res.status(201).json(
        resObg
      )
    }

  } catch (err) {
    next(err)
  }
})


// //Get All Venues for a Group specified by its id  find venue - task 11
router.get("/:id/venues", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const venues = await Location.findAll({
      where: {
        groupId: req.params.id
      }
    })

    const list = []
    venues.forEach(venue => {
      list.push(venue.toJSON())
    })
    list.forEach(item => {
 
  
      item.lat= item.lat;
      item.lng=item.lng;
      delete item.lat
      delete item.lng
      delete item.createdAt
      delete item.updatedAt

    

    })
    res.json(
      {
        Venues:list
      }
    )
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
      lng } = req.body
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const venue = await Location.create({
      address,
      city,
      state,
      lat: lat,
      lng: lng,
      groupId: req.params.id
    })
    const resObj = {
      "id": venue.id,
      "groupId": venue.groupId,
      "address": venue.address,
      "city": venue.city,
      "state": venue.state,
      "lat": venue.lat,
      "lng": venue.lng,
    }
    res.status(201).json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})


// //Edit a Group - task 9
router.put("/:id", [requireAuth, restoreUser, validateGroups], async (req, res, next) => {

  try {
    const group = await Group.findByPk(req.params.id)

    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    await group.update(req.body)
    await group.save()
    res.json(
      group
    )
  } catch (err) {
    next(err)
  }
})

// // Get details of a Group from an id - task 6 ?? does not show user
router.get("/:id", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["lastName", "firstName", "id"]
        },
        {
          model: GroupImage,
          attributes: ["id", "url", "preview"]
        },
        {
          model: Location,
          attributes: [
            "id",
            "groupId",
            "address",
            "city",
            "state",
            "lat",
            "lng"
          ]
        }
      ],

    }
    )
    if (!group) {
      next({
        statusCode: 404,
        message: `Could not find group ${req.params.id}`
      })
    }

    // let membership = await Membership.findAll({
    //   where: {
    //     groupId: group.id
    //   }
    // })


    // const organaizer = await User.findByPk(group.organizerId, {
    //   attributes: ["id", "lastName", "firstName"]
    // })

    // const location = await Location.findAll({
    //   where: {
    //     groupId: group.id
    //   }
    // })
    
    const resObj = {
      "id": group.id,
      "organizerId": group.organizerId,
      "name": group.name,
      "about": group.about,
      "type": group.type,
      "private": group.private,
      "city": group.city,
      "state": group.state,
      "createdAt": group.createdAt,
      "updatedAt": group.updatedAt,
      // "numMembers": membership.length,
      "GroupImage": group.GroupImages,
      "Organizer": group.User,
      "Venues": group.Locations,
    }
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})

// //Delete a Group - task 10
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const userId = req.user.id
    if (group.organizerId !== userId) {
      next({
        message: "Only owner can delete a group",
        statusCode: 403
      })
   
    }
    await group.destroy()
    res.json({
      "message": "Successfully deleted",
      statusCode: 200
    })
  } catch (err) {
    next(err)
  }
})

 // Create a Group  - task 7(??? automatic organizer add to membership)

router.post("/", [requireAuth, validateGroups], async (req, res, next) => {
  try {
    const { name, about, type, private, city, state } = req.body
    const user = req.user
    const group = await Group.create({
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId: +user.id
    })

    // await Membership.create({
    //   status: "organizer",
    //   userId: +req.user.id,
    //   groupId: +group.id
    // })

    res.status(201).json(
      group
    )
  } catch (err) {
    next(err)
  }
})

//Get all Groups - task ????(no numMembers)
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImage,
          attributes: ['preview', "url"]
        },

      ]
    })
  
    const list = []
    groups.forEach(group => {
      list.push(group.toJSON())
    })
    list.forEach(item => {
      item.GroupImages.forEach(image => {
        if (image.preview === true) {
          item.previewImage = image.url
        }
      })
      if (!item.previewImage) {
        item.previewImage = 'no photo added'
      }

      delete item.GroupImages

    })




    res.json({
      Groups: list
    }
    )
    return;
  } catch (err) {
    next(err)
  }
  return
})






module.exports = router;