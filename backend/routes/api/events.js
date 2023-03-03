const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const sequelize = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, EventImage, Group, Location, User, Attendance, Membership } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser } = require('../../utils/auth.js');
const membership = require('../../db/models/membership');
const user = require('../../db/models/user');
router.use(restoreUser)

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


//Get all Events  Add Query Filters to Get All Events - task 14 + 31

router.get("/", async (req, res, next) => {
  try {

    const events = await Event.findAll({
      subQuery: false,
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("numAttending.id")), "numAttending"],
          [sequelize.col("EventImages.url"), "previewImage"],
        ]
      },
      include: [
        {
          model: Attendance, as: "numAttending", attributes: [], duplicating: false
        },
        {
          model: Group, attributes: ["id", "name", "city", "state"], duplicating: false
        },
        {
          model: Location, attributes: ["id", "city", "state"], duplicating: false
        },
        {
          model: EventImage, attributes: [], duplicating: false
        }
      ],
      group: ["Event.id", "Group.id", "numAttending.id", "Location.id", "EventImages.id"],


    })
    const list = []
    events.forEach(event => {
      list.push(event.toJSON())
    })
    list.forEach(item => {
      if (item.locationId && item.Location) {
        item.venueId = item.locationId
        item.Venue = item.Location
      }
      if (!item.locationId || !item.Location) {
        item.venueId = null
        item.Venue = null
      }
      delete item.Location
      delete item.price
      delete item.capacity
      delete item.description
      delete item.locationId
    })

    res.json({
      Events: list

    }

    )
  } catch (err) {
    next(err)
  }
})



//Get details of an Event specified by its id eventImage get venue get - task 16
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      subQuery: false,
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("numAttending.id")), "numAttending"],
        ]
      },
      include: [
        {
          model: Attendance, as: "numAttending", attributes: [], duplicating: false
        },
        {
          model: Group, attributes: ["id", "name", "city", "state"], duplicating: false
        },
        {
          model: Location, attributes: ["id", "city", "state"], duplicating: false
        },
        {
          model: EventImage, attributes: ["id", "url", "preview"], duplicating: false
        }
      ],
      group: ["Event.id", "Group.id", "numAttending.id", "Location.id", "EventImages.id"],
    })
    if (!event) {
      next({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    let resObj = {
      "id": event.id,
      "groupId": event.groupId,
      "name": event.name,
      "description": event.description,
      "type": event.type,
      "capacity": event.capacity,
      "price": event.price,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "numAttending": event.numAttending || 0,
      "Group": event.Group,
      "EventImages": event.EventImages
    }
    if (event.locationId && event.Location) {
      resObj.venueId = event.locationId
      resObj.Venue = event.Location
    }
    if (!event.Location || !event.locationId) {
      resObj.venueId = null
      resObj.Venue = null
    }
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})




// //Add an Image to a Event based on the Event's id ???addImage - task 18
router.post("/:id/images", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      next({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    const attend = await Attendance.findAll({
      where: {
        eventId: req.params.id,
        userId: req.user.id
      }
    })
    if (!attend) {
      next({
        message: "Must be an attend create an Event",
        statusCode: 403
      })
    }
    const {
      url,
      preview
    } = req.body
    const image = await EventImage.create({
      url,
      preview,
      eventId: +req.params.id
    })

    const img = await EventImage.findByPk(image.id)
    res.status(201).json(
      img
    )


  } catch (err) {
    next(err)
  }
})




// Edit an Event specified by its id 
router.put("/:id", [requireAuth, validateEvents], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    const {
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    } = req.body
    if (!event) {
      next({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    const group = await Group.findByPk(event.groupId)
    const coHost = await Membership.findAll({
      where: {
        groupId: event.groupId,
        memberId: req.user.id,
        status: 'co-host'
      }
    })
    if (req.user.id !== group.organizerId && !coHost) {
      next({
        message: "only organizer or co-host can edit an event",
        statusCode: 404
      })
    }


    await event.update({
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate

    })
    const resObj = {
      "id": event.id,
      "groupId": event.groupId,
      "venueId": event.locationId,
      "name": event.name,
      "type": event.type,
      "capacity": event.capacity,
      "price": event.price,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
    }
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})




// //Delete an Event specified by its id delete event - task 20
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)


    if (!event) {
      next({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    const group = await Group.findByPk(event.groupId)
    const coHost = await Membership.findAll({
      where: {
        groupId: event.groupId,
        memberId: req.user.id,
        status: "co-host"
      }
    })

    if (!coHost && req.user.id !== group.organizerId) {
      next({
        message: "only organizer or co-host can delete an event",
        statusCode: 404
      })
    }
    await event.destroy()
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } catch (err) {
    next(err)
  }
})




// //Request Attendance to an Event
// router.post("/:id/attendance", requireAuth, async (req, res, next) => {

//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Event could not be found",
//         statusCode: 404
//       })
//     }
//     const attendees = await Attendees.create({
//       userId: +req.user.id,
//       eventId: +req.params.id,
//       status:"pending"
//     })
//     const resObj = {
//       userId: +req.user.id,
//       eventId: +req.params.id,
//       status:"pending"
//     }
//     res.status(201).json(
//       resObj
//     )
//   } catch (err) {
//     next(err)
//   }
// })


// /

// //Get all Attendees of an Event specified by its id ??? how compare- task 26
// router.get("/:id/atendens", [restoreUser, requireAuth], async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Group could not be found",
//         statusCode: 404
//       })
//     }
//     const user = req.user.id
//     const atendees = await Attendees.findOne()
//     res.json({
//       "Attendees": atendees
//     })
//   } catch (err) {
//     next(err)
//   }
// })

// //Change the status of an attendance for an event specified by id - task 26
// router.put("/:id/attendance", requireAuth, async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Event could not be found",
//         statusCode: 404
//       })
//     }
//     const user = req.user.id
//     const membership = await Membership.findOne({
//       where: {
//         userId: user
//       }
//     })
//     // const status = membership.dataValues.status
//     // if (status === "organaizer" || status === "co-host") {
//       const attendees = await Attendees.update({
//         userId: req.body.userId,
//         eventId: +req.params.id,
//         status: req.body.status
//       }, {
//         where: {
//           eventId: +req.params.id
//         }
//       })

//       const resObg = {
//         userId: +user,
//         eventId: +req.params.id,
//         id: attendees.id,
//         status: req.body.status
//       }
//       res.json(
//         resObg
//       )
//     // } else {
//     //   next({
//     //     statusCode: 403,
//     //     message: "you can not change it"

//     //   })
//     // }


//   } catch (err) {
//     next(err)
//   }
// })

// //Delete attendance to an event specified by id - task 27
// // 

// router.delete("/:id/attendance", [restoreUser, requireAuth], async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Event could not be found",
//         statusCode: 404
//       })
//     }
//     const userId = req.user.id
//     if (!userId) {
//       next({
//         message: "You ara not autorized",
//         status: 403
//       })
//     }
//     if (!req.body.memberId) {
//       next({
//         message: "No member id",
//         status: 404
//       })
//     }
//     if (req.body.memberId !== userId) {
//       const membership = await Membership.findOne({
//         where: {
//           userId,
//           groupId: event.id
//         }
//       })
//       if (!membership) {
//         next({
//           message: "You ara not autorized",
//           status: 403
//         })
//       }
//       const status = membership.dataValues.status

//       if (status !== "organaizer" && status !== "co-host") {     
//         next({
//           "message": "Only the User or organizer may delete an Attendance",
//           "statusCode": 403
//         });
//       }
//     }
//     const attendees = await Attendees.findOne({
//       where: {
//         userId: +req.body.memberId,
//         eventId: +req.params.id,
//       }
//     })
//     if (!attendees) {
//       next({
//         "message": "Attendance does not exist for this User",
//         "statusCode": 404
//       })
//     }
//     console.log(attendees.id)

//     await Attendees.destroy({
//       where: {
//         userId: +req.body.memberId,
//         eventId: +req.params.id,
//       }
//     });
//     res.json({
//       "message": "Successfully deleted attendance from event"
//     })


//   // const attendees = await Attendees.findOne()

// } catch (err) {
//   next(err)
// }
// });




// //Get all Attendees of an Event specified by its id - task 25
// router.get("/:id/attendees", async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Event could not be found",
//         statusCode: 404
//       })
//     }
//     const groupId = event.groupId;
//     let currentUserMembership = undefined;
//     if (req.user) {
//       currentUserMembership = Membership.findAll({
//         where: {
//           userId: req.user.id,
//           groupId: groupId
//         }
//       });
//     }
//     const attendees = await Attendees.findAll({
//       where: {
//         eventId: event.id
//       }
//     });

//     const userList = [];
//     for (let i = 0; i < attendees.length; i++) {
//       let membership = await Membership.findOne({
//         where: {
//           userId: attendees[i].userId,
//           groupId: groupId
//         }
//       });

//       if (membership.status !== "pending" ||
//         (currentUserMembership &&
//           (currentUserMembership.status == "co-host" || currentUserMembership.status == "organaizer"))) {
//         let user = await User.findByPk(attendees[i].userId)
//         userList.push({
//           id: user.id,
//           "firstName": user.firstName,
//           "lastName": user.lastName,
//           "Attndance": {
//             "status": membership.status
//           }
//         })
//       }

//     }
//     res.json({
//       "Attendees": userList
//     })
//   } catch (err) {
//     next(err)
//   }
// });









// router.put("/:id/attendance", [requireAuth, validateEvents], async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if (!event) {
//       next({
//         message: "Event could not be found",
//         statusCode: 404
//       })
//     }
//     const userId = req.user.id
//     const membership = await Membership.findOne({
//       where: {
//         userId
//       }
//     })
//     const status = membership.dataValues.status
//     if (status === "organaizer" || status === "co-host") {
//       if (req.body.status === "pending") {
//         next({
//           "message": "Cannot change an attendance status to pending",
//           "statusCode": 400
//         })
//       }
//       const attendees = await Attendees.findOne({
//         where: {
//           userId: +req.body.id,
//           eventId: +req.params.id,
//         }
//       })
//       if (!attendees) {
//         next({
//           "message": "Attendance between the user and the event does not exist",
//           "statusCode": 404
//         })
//       }
//       await attendees.update({
//         userId: +req.body.id,
//         eventId: +req.params.id,
//         status: req.body.status
//       }, {
//         where: {
//           eventId: +req.params.id
//         }
//       })
//       // const resObg = {
//       //   userId: +userId,
//       //   eventId: +req.params.id,
//       //   id: attendees.dataValues.id,
//       //   status: req.body.status
//       // }
//       res.json(
//         attendees
//       )
//     } else {
//       next({
//         statusCode: 403,
//         message: "you can not change it"
//       })
//     }
//   } catch (err) {
//     next(err)
//   }
// })










module.exports = router;