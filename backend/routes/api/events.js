const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { json } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, EventImages, Attendees, Group, Location, User, Membership } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser } = require('../../utils/auth.js');
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

//Add an Image to a Event based on the Event's id ???addImage - task 18
router.post("/:id/images", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      next({
        message: "Event couldn't be found",
        status: 404
      })
    }
    if (event) {
      const {
        url,
        preview
      } = req.body
      const image = await EventImages.create({
        url,
        preview,
        eventId: +req.params.id
      })
      const resObj ={
        "id": image.id,
        "url": image.url,
        "preview":image.preview
      }

      res.status(201).json(
        resObj
      )
    }

  } catch (err) {
    next(err)
  }
})

//Add an Image to a Event based on the Event's id ???addImage - task 30
router.delete("/:id/images", [restoreUser, requireAuth], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    const {
      url,
      preview
    } = req.body
    if (!event) {
      next({
        message: "Event couldn't be found",
        status: 404
      })
    }

    res.json({
      "message": "Successfully deleted",
      status: 200
    })
  } catch (err) {
    next(err)
  }
})






//Request Attendance to an Event
router.post("/:id/attendance", requireAuth, async (req, res, next) => {
  console.log(req.user.id)
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        status: 404
      })
    }
    const attendees = await Attendees.create({
      userId: +req.user.id,
      eventId: +req.params.id
    })
    const resObj = {
      userId: +req.user.id,
      eventId: +req.params.id
    }
    res.status(201).json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})


//Get all Attendees of an Event specified by its id - task 25
// router.get("/:id/attendees", async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.id)
//     if(!event){
//       next({
//         message: "Event could not be found",
//         status: 404
//       })
//     }
//     const attend = await Attendees.findOne({
//       where:{
//         eventId:+req.params.id
//       }
//     })
//     console.log(attend)
// const user = await User
// const attendees = await Attendees.findAll({
//   where:{
//     eventId:+req.params.id
//   },
//    include:[
//     {
//       model:User,
//       attributes:["firstName", "lastName"]
//     }
//    ]
// })
// res.json({
// "Attendees": attendees
//   })
// } catch (err) {
//   next(err)
// }
// })

//Get all Attendees of an Event specified by its id ??? how compare- task 26
router.get("/:id/atendens", [restoreUser, requireAuth], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    const user = req.user.id
    const atendees = await Attendees.findOne()
    res.json({
      "Attendees": atendees
    })
  } catch (err) {
    next(err)
  }
})

//Change the status of an attendance for an event specified by id - task 26
router.put("/:id/attendance", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        status: 404
      })
    }
    const user = req.user.id
    const membership = await Membership.findOne({
      where: {
        userId: user
      }
    })
    const status = membership.dataValues.status
    if (status === "organaizer" || status === "co-host") {
      const attendees = await Attendees.update({
        userId: +user,
        eventId: +req.params.id,
        status: req.body.status
      }, {
        where: {
          eventId: +req.params.id
        }
      })

      const resObg = {
        userId: +user,
        eventId: +req.params.id,
        id: attendees.id,
        status: req.body.status
      }
      res.json(
        resObg
      )
    } else {
      next({
        status: 403,
        message: "you can not change it"

      })
    }


  } catch (err) {
    next(err)
  }
})

//Delete attendance to an event specified by id - task 27
// 

router.delete("/:id/attendance", [restoreUser, requireAuth], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        status: 404
      })
    }
    const userId = req.user.id
    if (!userId) {
      next({
        message: "You ara not autorized",
        status: 403
      })
    }
    if (!req.body.memberId) {
      next({
        message: "No member id",
        status: 404
      })
    }
    if (req.body.memberId !== userId) {
      const membership = await Membership.findOne({
        where: {
          userId,
          groupId: event.id
        }
      })
      if (!membership) {
        next({
          message: "You ara not autorized",
          status: 403
        })
      }
      const status = membership.dataValues.status

      if (status !== "organaizer" && status !== "co-host") {     
        next({
          "message": "Only the User or organizer may delete an Attendance",
          "statusCode": 403
        });
      }
    }
    const attendees = await Attendees.findOne({
      where: {
        userId: +req.body.memberId,
        eventId: +req.params.id,
      }
    })
    if (!attendees) {
      next({
        "message": "Attendance does not exist for this User",
        "statusCode": 404
      })
    }
    console.log(attendees.id)

    await Attendees.destroy({
      where: {
        userId: +req.body.memberId,
        eventId: +req.params.id,
      }
    });
    res.json({
      "message": "Successfully deleted attendance from event"
    })
  
  
  // const attendees = await Attendees.findOne()

} catch (err) {
  next(err)
}
});




//Get all Attendees of an Event specified by its id - task 25
router.get("/:id/attendees", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        status: 404
      })
    }
    const groupId = event.groupId;
    let currentUserMembership = undefined;
    if (req.user) {
      currentUserMembership = Membership.findAll({
        where: {
          userId: req.user.id,
          groupId: groupId
        }
      });
    }
    const attendees = await Attendees.findAll({
      where: {
        eventId: event.id
      }
    });

    const userList = [];
    for (let i = 0; i < attendees.length; i++) {
      let membership = await Membership.findOne({
        where: {
          userId: attendees[i].userId,
          groupId: groupId
        }
      });
      console.log(membership);
      if (membership.status !== "pending" ||
        (currentUserMembership &&
          (currentUserMembership.status == "co-host" || currentUserMembership.status == "organaizer"))) {
        let user = await User.findByPk(attendees[i].userId)
        userList.push({
          id: user.id,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "Attndance": {
            "status": membership.status
          }
        })
      }

    }
    res.json({
      "Attendees": userList
    })
  } catch (err) {
    next(err)
  }
});

// Edit an Event specified by its id ???edit event - task 19
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
        status: 404
      })
    }
await event.update({
  name, 
  type, 
  capacity, 
  price, 
  description, 
  dateOfStart:startDate, 
  dateOfEnd:endDate

})
const resObj={
  "id": event.id,
  "groupId": event.groupId,
  "venueId": event.locationId,
  "name": event.name,
  "type": event.type,
  "capacity": event.capacity,
  "price": event.price,
  "description":event.description,
  "startDate": event.dateOfStart,
  "endDate": event.dateOfEnd,
}
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})







router.put("/:id/attendance", [requireAuth, validateEvents], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        status: 404
      })
    }
    const userId = req.user.id
    const membership = await Membership.findOne({
      where: {
        userId
      }
    })
    const status = membership.dataValues.status
    if (status === "organaizer" || status === "co-host") {
      if (req.body.status === "pending") {
        next({
          "message": "Cannot change an attendance status to pending",
          "statusCode": 400
        })
      }
      const attendees = await Attendees.findOne({
        where: {
          userId: +req.body.id,
          eventId: +req.params.id,
        }
      })
      if (!attendees) {
        next({
          "message": "Attendance between the user and the event does not exist",
          "statusCode": 404
        })
      }
      await attendees.update({
        userId: +req.body.id,
        eventId: +req.params.id,
        status: req.body.status
      }, {
        where: {
          eventId: +req.params.id
        }
      })
      // const resObg = {
      //   userId: +userId,
      //   eventId: +req.params.id,
      //   id: attendees.dataValues.id,
      //   status: req.body.status
      // }
      res.json(
        attendees
      )
    } else {
      next({
        status: 403,
        message: "you can not change it"
      })
    }
  } catch (err) {
    next(err)
  }
})



//Delete an Event specified by its id delete event - task 20
router.delete("/:id", [restoreUser, requireAuth], async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      next({
        message: "Event couldn't be found",
        status: 404
      })
    }
    await event.destroy()
    res.json({
      "message": "Successfully deleted"
    })
  } catch (err) {
    next(err)
  }
})

//Get details of an Event specified by its id eventImage get venue get - task 16
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Group,
          attributes: ["id", "name", "private", "city", "state"]
        },
        {
          model: Location,
          attributes: ["address", "city", "state", "latitude", "longtitude"]
        },
        {
          model: EventImages,
          attributes: ["id", "url", "preview"]
        }
      ]
    });
    if (!event) {
      next({
        message: "Event couldn't be found",
        status: 404
      })
    }
    res.json({
      event
    })
  } catch (err) {
    next(err)
  }
})

//Get all Events  Add Query Filters to Get All Events - task 14 + 31
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include:[
        {
          model:Location,
          attributes:["city", "id", "state"]
        },
        {
          model:Group,
          attributes:["id", "name", "city", "state"]
        }
      ]
    });
    res.json({
      events
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router;