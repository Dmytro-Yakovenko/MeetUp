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
const e = require('express');
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
    const filter = {};
    let limit = null;
    let offSet = null;
    let { page, size, type, startDate, name } = req.params;
    if (size && size < 1) {
      next({
        message: "Size must be greater than or equal to 0",
        "statusCode": 400
      })
    }
    if (size && (size >= 1 || size <= 20)) {
      limit = size
    } else {
      limit = 20
    }
    if (page && page < 1) {
      next({
        message: "Page must be greater than or equal to 0",
        "statusCode": 400
      })
    }
    if (page && (page >= 1 || page <= 20)) {
      offSet = limit * (page - 1)
    } else {
      offSet = 0
    }
    if (name) {
      if (!isNaN(name)) {
        return next({
          message: "name should be a string",
          statusCode: 400
        })
    
      }
      filter.name = name;
    }
    if (type) {
      if (type !== "OnLine" || type !== 'In person') {
       return next({
          message: "Type must be 'Online' or 'In Person'",
          statusCode: 400
        })
      }
      filter.type = type;
    }
   
    if (startDate) {
      const date = Date.parse(startDate)
      if (isNaN(date)) {
       return next({
          message: "Start date must be a valid datetime",
          statusCode: 400
        }
        )

      }
      filter.startDate = startDate;
    }
console.log(filter)
    const events = await Event.findAll({
      where:filter,
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
      limit, offSet

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


//Get all Attendees of an Event specified by its id ??? how compare- task 26
router.get("/:id/attendees", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        statusCode: 404
      })
    }
    const user = req.user.id

    const group = await Group.findOne({
      where: {
        id: event.groupId
      }
    })
    const coHost = await Membership.findAll({
      where: {
        groupId: group.id,
        memberId: user,
        status: 'co-host'
      }
    })

    // Not co=host or organizer
    if (!req.user || user !== group.organizerId && !coHost) {
      const attend = await User.findAll({
        attributes: [
          'id', "firstName", "lastName"
        ],
        include: {
          model: Attendance,
          where: {
            eventId: event.id,
            [Op.or]: [
              {
                status: 'member',

              },
              {
                status: "waitlist"
              }
            ]
          },
          attributes: ['status']
        }
      })
      return res.json({
        "Attendees": attend
      })
    }
    // co-host or organizer 
    const attend = await User.findAll({
      attributes: [
        "id", "firstName", "lastName"
      ],
      include: {
        model: Attendance,
        where: {
          eventId: event.id,
        },
        attributes: ['status']
      }
    })
    res.json({
      "Attendees": attend
    }
    )
  } catch (err) {
    next(err)
  }
})




// //Request Attendance to an Event
router.post("/:id/attendance", requireAuth, async (req, res, next) => {

  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        statusCode: 404
      })
    }
    const isPend = await Attendance.findOne({
      where: {
        eventId: req.params.id,
        userId: req.user.id,
        status: 'pending'
      }
    })
    if (isPend) {
      next({
        message: "Attendance has already been requested",
        statusCode: 400
      })
    }

    const isAccepted = await Attendance.findOne({
      where: {
        eventId: req.params.id,
        userId: req.user.id,
      }
    })
    if (isAccepted) {
      next({
        message: "User is already an attendee of the event",
        statusCode: 400
      })
    }
    const attendees = await Attendance.create({
      userId: +req.user.id,
      eventId: +req.params.id,
      status: "pending"
    })

    const attend = await Attendance.scope('submission').findByPk(attendees.id)
    res.status(201).json(
      attend
    )
  } catch (err) {
    next(err)
  }
})






//Change the status of an attendance for an event specified by id - task 26
router.put("/:id/attendance", requireAuth, async (req, res, next) => {
  try {
    if (req.body.status === 'pending') {
      next({
        "message": "Cannot change an attendance status to pending",
        "statusCode": 400
      })
    }
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        statusCode: 404
      })
    }
    const user = req.user.id
    const group = await Group.findOne({
      where: {
        id: event.groupId
      }
    })
    const coHost = await Membership.findAll({
      where: {
        groupId: group.id,
        memberId: user,
        status: 'co-host'
      }
    })
    if (!coHost && user !== group.organizerId) {
      next({
        message: 'Organizer or co-host can change status of an attendance',
        status: 403
      })
    }

    const attend = await Attendance.findOne({
      where: {
        eventId: req.params.id,
        userId: user,
        status: "pending"
      }
    })

    if (!attend) {
      next({
        "message": "Attendance between the user and the event does not exist",
        "statusCode": 404
      })
    }
    await attend.update({
      userId: req.body.userId,
      eventId: +req.params.id,
      status: req.body.status
    })
    const updated = await Attendance.findByPk(attend.id)
    res.json(
      updated
    )



  } catch (err) {
    next(err)
  }
})

//Delete attendance to an event specified by id - task 27
// 

router.delete("/:id/attendance", requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) {
      next({
        message: "Event could not be found",
        statusCode: 404
      })
    }
    const group = await Group.findOne({
      where: {
        id: event.groupId
      }
    })
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const attend = await Attendance.findOne({
      where: {
        eventId: +event.id,
        userId: +req.body.memberId
      }
    })
    // const attend = await Attendance.findAll()
    console.log(attend)
    console.log(event.id)
    console.log(req.body.memberId)
    if (!attend) {
      next({
        message: "Attendance does not exist for this User",
        statusCode: 404
      })
      return
    }
    const userId = req.user.id

    if (userId !== group.organizerId && userId !== req.params.id) {
      next({
        message: "Only the User or organizer may delete an Attendance",
        status: 403
      })
      return
    }



    await attend.destroy();
    res.json({
      "message": "Successfully deleted attendance from event"
    })

  } catch (err) {
    next(err)
  }
});













module.exports = router;