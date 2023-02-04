const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { json } = require('sequelize');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImages, Event, Attendees, Location, EventImages } = require('../../db/models');
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
    .isIn(['OnLine', 'In person'])
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

//In what we shoud use scope

router.get("/current", requireAuth, async (req, res, next) => {
  try {
    let groups = await Group.findAll({
      where: {
        organizerId: req.user.id
      },
      include: {
        model: GroupImages,
        attributes: ["preview", "url"]
      }
    })

    const resObj = {}

    const list = []
    for (let i = 0; i < groups.length; i++) {

      let membership = await Membership.findAll({
        where: {
          GroupId: groups[i].dataValues.id
        }
      });


      const obj = {
        id: groups[i].dataValues.id,
        name: groups[i].dataValues.name,
        organizerId: groups[i].dataValues.organizerId,
        about: groups[i].dataValues.aboutgroups,
        type: groups[i].dataValues.type,
        private: groups[i].dataValues.private,
        city: groups[i].dataValues.city,
        state: groups[i].dataValues.state,
        createdAt: groups[i].dataValues.createdAt,
        updatedAt: groups[i].dataValues.updatedAt,
        previewImage: (groups[i].dataValues.GroupImages.length > 0) ? groups[i].dataValues.GroupImages[0].url : "no photo yet",
        numMembers: membership.length
      }
      list.push(obj)
    }
    resObj.Groups = list
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})





// Get all Groups joined or organized by the Current User - task 5
router.get("/auth", requireAuth, async (req, res, next) => {
  try {
    let groups = await Group.findAll({
      where: {
        organizerId: req.user.id
      }
    })
    res.json(
      groups
    )
  } catch (err) {
    next(err)
  }
})

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
    if (!url) {
      next({
        statusCode: 400,
        message: "Validation Error"
      })
    }
    const image = await GroupImages.create({
      url,
      preview,
      GroupId: +req.params.id
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

// //  Delete an Image for a Group - task 29
// router.delete("/:id/images", requireAuth, async (req, res, next) => {
//   try {
//     const group = await Group.findByPk(req.params.id);
//     if (!group) {
//       next({
//         message: "Group could not be found",
//         status: 404
//       })
//     }
//      await GroupImages.destroy({
//      where:{
//       GroupId:+req.params.id
//      }
//     })
//     res.json({
//       message: "Successfully deleted",
//       status: 200
//     })
//   } catch (err) {
//     next(err)
//   }
// })

//Get all Members of a Group specified by its id ??? find members - task 21
router.get("/:id/members", [requireAuth, restoreUser], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const members = await Membership.findAll()
    res.json(
      members
    )
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
router.post("/:id/membership", requireAuth, async (req, res, next) => {
  try {

    const group = await Group.findByPk(+req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }

    const userId = +req.user.id
    const membership = await Membership.findOne({
      where: {
        userId: userId,
        GroupId: group.id
      }
    })

    if (membership && membership.dataValues.status === "pending") {
      next({
        "message": "Membership has already been requested",
        "statusCode": 400
      })
    }

    if (membership && membership.dataValues.status === "member") {
      next({
        "message": "Membership has already been requested",
        "statusCode": 400
      })
    }


    const member = await Membership.create({
      userId: +req.user.id,
      GroupId: +req.params.id,
      status: "pending"
    })
    const resObj = {
      memberId: member.userId,
      status: member.status,
      GroupId: member.GroupId
    }
    res.status(201).json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})






//Change the status of a membership for a group specified by id ??? find membership - task 23
router.put("/:id/membership", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const member = await Membership.findOne({
      where: {
        // groupId: group.id,
        userId: +req.user.id
      }
    })
    // console.log(member)
    // if (!member) {
    //   next({
    //     message: "request to join group not found",
    //     statusCode: 404
    //   })
    // }
    // member.update({
    //   status: req.body.status
    // }
    // )

    // const resObg = {
    //   "id": member.id,
    //   "groupId": member.groupId,
    //   "memberId": member.userId,
    //   "status": member.status
    // }
    console.log(member)
    // res.json(resObg)
    // const status = member.dataValues.status

    //if (status === "organaizer" || status === "co-host") {
    const membership = await Membership.update({
      userId: req.body.memberId,
      groupId: +req.params.id,
      status: req.body.status
    }, {
      where: {
        groupId: +req.params.id
      }
    })

    const resObg = {
      userId: req.body.memberId,
      eventId: +req.params.id,
      id: membership.id,

      status: req.body.status
    }
    res.json(
      resObg
    )
    // }else {
    //   next({
    //     statusCode: 403,
    //     message: "you can not change it"

    //   })
    //}
  } catch (err) {
    next(err)
  }
})

//Delete membership to a group specified by id ??? find membership - task 24
router.delete("/:id/membership", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const userId = req.user.id
    const membership = await Membership.findOne({
      where: {
        userId: userId,
        GroupId: group.dataValues.id
      }
    })
    if (!membership) {
      next({
        message: "Group could not be found",
        status: 404
      })
    }
    if (membership.dataValues.status === "co-host" || membership.dataValues.status === "organaizer" || membership.dataValues.userId === userId) {
      await Membership.destroy({
        where: {
          GroupId: +req.params.id
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
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const event = await Event.findAll({
      where: {
        GroupId: req.params.id
      },
      include: [
        {
          model: Group,
          attributes: [
            "id",
            "name",
            "private",
            "city",
            "state"
          ]
        },
        {
          model: Location,
          attributes: [
            "id",
            "address",
            "city",
            "state",
            "latitude",
            "longtitude"
          ]
        },
        {
          model: EventImages,
          attributes: [
            "id",
            "url",
            "preview"
          ]
        }
      ]
        });
      
    const list = []
    const resObg = {}
    for (let i = 0; i < events.length; i++) {
      const item = events[i].dataValues
      console.log(item.Location.dataValues)
      const numAttending = await Attendees.findAll({
        where: {
          eventId: item.id
        }
      })
      list.push({
        "id": item.id,
        "groupId": item.groupId,
        "venueId": (item.Location) ? item.Location.dataValues.id : null,
        "name": item.name,
        "type": item.type,
        "startDate": item.dateOfStart,
        "endDate": item.dateOfEnd,
        "numAttending": numAttending.length,
        "previewImage": (item.EventImages.length > 0) ? item.EventImages[0].url : "no photo",
        "Group": item.Group,
        "Venue": (item.Location) ? item.Location.dataValues : null

      })
    }
    resObg.Events = list



    res.json(
      resObg
    )
  } catch (err) {
    next(err)
  }
})

//Create an Event for a Group specified by its id ??? find events - task 17

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
        dateOfStart: startDate,
        dateOfEnd: endDate,
        GroupId: +req.params.id,
        locationId: venueId
      })
      const resObg = {
        "id": event.id,
        "GroupId": event.GroupId,
        "venueId": event.locationId,
        "name": event.name,
        "type": event.type,
        "capacity": event.capacity,
        "price": event.price,
        "description": event.description,
        "startDate": event.dateOfStart,
        "endDate": event.dateOfEnd
      }
      res.status(201).json(
        resObg
      )
    }

  } catch (err) {
    next(err)
  }
})


//Get All Venues for a Group specified by its id  find venue - task 11
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
        GroupId: req.params.id
      }
    })
    const resObj = {

    }
    const list = []
    for (let i = 0; i < venues.length; i++) {
      list.push({
        "id": venues[i].id,
        "GroupId": venues[i].GroupId,
        "address": venues[i].address,
        "city": venues[i].city,
        "state": venues[i].state,
        "lat": venues[i].latitude,
        "lng": venues[i].longtitude,

      })
    }
    resObj.Venues = list
    res.json(
      resObj
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
      latitude: lat,
      longtitude: lng,
      GroupId: req.params.id
    })
    const resObj = {
      "id": venue.id,
      "GroupId": venue.GroupId,
      "address": venue.address,
      "city": venue.city,
      "state": venue.state,
      "lat": venue.latitude,
      "lng": venue.longtitude,
    }
    res.status(201).json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})


//Edit a Group - task 9
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

// Get details of a Group from an id - task 6 ?? does not show user
router.get("/:id", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["lastName", "firstName", "id"]
        },
        {
          model: GroupImages,
          attributes: ["id", "url"]
        },
        {
          model: Location,
          attributes: [
            "id",
            "GroupId",
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
        statusCode: 404,
        message: `Could not find group ${req.params.id}`
      })
    }

    let membership = await Membership.findAll({
      where: {
        groupId: group.id
      }
    })


    const organaizer = await User.findByPk(group.organizerId, {
      attributes: ["id", "lastName", "firstName"]
    })

    const location = await Location.findAll({
      where: {
        groupId: group.id
      }
    })

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
      "numMembers": membership.length,
      "GroupImages": group.GroupImages,
      "Organizer": organaizer,
      "Venues": location,
    }
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})

//Delete a Group - task 10
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
    // if (group.organizerId === userId) {
    //   await group.destroy()
    //   res.json({
    //     "message": "Successfully deleted",
    //     statusCode: 200
    //   })
    // } else {
    //   next({
    //     message: "Only owner can delete a group",
    //     statusCode: 403
    //   })
    // }
    await group.destroy()
    res.json({
      "message": "Successfully deleted",
      statusCode: 200
    })
  } catch (err) {
    next(err)
  }
})

// Create a Group  - task 7

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

    await Membership.create({
      status: "organaizer",
      userId: +req.user.id,
      GroupId: +group.id
    })

    res.status(201).json(
      group
    )
  } catch (err) {
    next(err)
  }
})

//Get all Groups - task 4
router.get("/", async (req, res, next) => {
  try {
    console.log(11111)
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImages,
          attributes: ['preview']
        },
      ]
    })
    console.log(222222)
    const resObj = {

    }
    const list = []
    for (let i = 0; i < groups.length; i++) {
      console.log(33333)
      let membership = await Membership.findAll({
        where: {
          GroupId: groups[i].dataValues.id
        }
      });
      console.log(44444)
      const previewImage = await GroupImages.findAll({
        where: {
          groupId: groups[i].id,
          preview: true
        }
      });
      const obj = {
        id: groups[i].dataValues.id,
        groupId: groups[i].dataValues.id,
        name: groups[i].dataValues.name,
        organizerId: groups[i].dataValues.organizerId,
        about: groups[i].dataValues.about,
        type: groups[i].dataValues.type,
        private: groups[i].dataValues.private,
        city: groups[i].dataValues.city,
        state: groups[i].dataValues.state,
        createdAt: groups[i].dataValues.createdAt,
        updatedAt: groups[i].dataValues.updatedAt,
        previewImage: previewImage && previewImage.length > 0,
        numMembers: membership.length
      }
      list.push(obj)
    }
    resObj.Groups = list

    res.json(
      resObj
    )
    return;
  } catch (err) {
    next(err)
  }
  return
})

module.exports = router;