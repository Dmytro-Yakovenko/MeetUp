const express = require("express");
const router = express.Router();
const { check } = require("express-validator");



const { restoreUser, requireAuth } = require("../../utils/auth");

const { User, Group, GroupImage, Event, Location, EventImage, Membership, Attendance, sequelize } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { json } = require("sequelize");

router.use(restoreUser)

const validateGroups = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["On line", "In person"])
    .withMessage("Type must be 'Online' or 'InPerson'"),
  check("private")
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("State is required"),
  handleValidationErrors
];

const validateVenues = [
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
    .withMessage("Longitude is not valid"),
  handleValidationErrors
]

const validateEvents = [
  check("venueId")
    .exists({ checkFalsy: true })
    .withMessage("Venue does not exist"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    // .isCurrency()
    .withMessage("Price is invalid"),

  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 15 })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    // .isDate()
    // .isAfter(new Date())
    .withMessage("Start date must be in the future"),
  check("endDate")
    .exists({ checkFalsy: true })
    // .isDate()
    // .isAfter("dateOfStart")
    .withMessage("End date is less than start date"),
  handleValidationErrors

]

//Get all Groups 
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      subQuery: false,
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"
          ],
          [sequelize.col("GroupImages.url"), "previewImage"]
        ]
      },
      include: [{
        model: Membership,
        attributes: [],
        dublicating: false
      }, {
        model: GroupImage,
        attributes: [],
        dublicating: false
      }],
      group: ["Group.id", "Memberships.id", "GroupImages.id"]
    })
    res.json(
      {
        Groups: groups
      }
    )
    return;
  } catch (err) {
    next(err)
  }
  return
})


// Get all Groups joined or organized by the Current User ???not working
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const groups = await Group.findAll(
      {
        where: {

          organizerId: req.user.id
        },

        include: [{
          model: Membership, attributes: ["id"]
        },
        {
          model: GroupImage, attributes: ["id", "url", "preview"]
        }],
      }
    )
    const list = [];
    groups.forEach(item => {
      list.push(item.toJSON())
    })

    list.forEach(item => {
      item.GroupImages.forEach(image => {
        if (image.preview === true) {
          item.previewImage = image.url
        }
      })
      if (!item.previewImage) {
        item.previewImage = "no photo added"
      }
      item.numMembers = item.Memberships.length
      delete item.Memberships
      delete item.GroupImages

    })

    res.json(
      {
        Groups: list
      }
    )
  } catch (err) {
    next(err)
  }
})


// // Get details of a Group from an id 
router.get("/:id", async (req, res, next) => {
  try {
 
    const groupById = await Group.findByPk(req.params.id)

    const location = await Location.findAll({
      where: {
        groupId: req.params.id
      },
      attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
    })
    const user = await User.findOne({
      where: {
        id: groupById.organizerId
      },
      attributes: ["id", "firstName", "lastName"]
    })
    const images = await GroupImage.findAll({
      where: {
        groupId: req.params.id

      },
      attributes: ["id", "url", "preview"]
    })

    const membership = await Membership.findAll({
      where: {
        groupId: req.params.id
      }
    })


    if (!groupById) {

      next({
        statusCode: 404,
        message: `Could not find group ${req.params.id}`
      })
    }
    const group = groupById.toJSON()

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
      "GroupImage": images,
      "Organizer": user,
      "Venues": location
    }
    // delete resObj.Memberships
    res.json(
      resObj
    )
  } catch (err) {
    next(err)
  }
})


// Create a Group 

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
    res.status(201).json(
      group
    )
  } catch (err) {
    next(err)
  }
})

//Add an Image to a Group based on the Group"s id  
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
    if (req.user.id !== group.organizerId) {
      next({
        statusCode: 403,
        message: "You are not organizer of the group"
      })
    }
    const image = await GroupImage.create({
      url,
      preview,
      groupId: +req.params.id
    })
    const img = await GroupImage.findByPk(image.id)
    res.status(201).json(
      img
    )
  } catch (err) {
    next(err)
  }
})


// //Edit a Group 
router.put("/:id", [requireAuth, validateGroups], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)

    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    if (req.user.id !== group.organizerId) {
      next({
        message: "You are not organizer",
        statusCode: 403
      })
    }
    await group.update(req.body)
    res.json(
      group
    )
  } catch (err) {
    next(err)
  }
})

// //Delete a Group 
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


//Get All Venues for a Group specified by its id  find venue 
router.get("/:id/venues", requireAuth, async (req, res, next) => {
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
    res.json(
      {
        Venues: venues
      }
    )
  } catch (err) {
    next(err)
  }
})


//Create a new Venue for a Group specified by its id  create validate venue - task 12
router.post("/:id/venues", [requireAuth, validateVenues], async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    const {
      address,
      city,
      state,
      lat,
      lng } = req.body
    const coHost = await Membership.findAll({
      where: {
        groupId: req.params.id,
        memberId: req.user.id,
        status: "co-host"
      }
    })
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    if (!coHost && req.user.id !== group.organizerId) {
      next({
        message: "Organizer or co-host can create venue",
        statusCode: 403
      })
    }
    const venue = await Location.create({
      address,
      city,
      state,
      lat,
      lng,
      groupId: req.params.id
    })

    const newVenue = await Location.findByPk(venue.id)
    res.status(201).json(newVenue)
  } catch (err) {
    next(err)
  }
})




//Get all Members of a Group specified by its id 
router.get("/:id/members", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)

    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const coHost = await Membership.findAll({
      where: {
        groupId: group.id,
        memberId: req.user.id,
        status: "co-host"
      }
    })
    //if not co-host
    if (!req.user || req.user.id !== group.organizerId && !coHost) {
      const members = await User.findAll({
        attributes: [
          "id", "firstName", "lastName"
        ],
        include: [
          {
            model: Membership,
            where: {
              groupId: group.id,
              [Op.or]: [
                { status: "member" },
                { status: "co-host" }
              ]
            },
            attributes: ["status"]
          }
        ]
      })
      return res.json(members)
    }
    // if co-host
    const members = await User.findAll({
      attributes:
        ["id", "firstName", "lastName"],
      include: [
        {
          model: Membership,
          where: {
            groupId: group.id
          },
          attributes: ["status"]
        }
      ]
    })

    res.json({
      "Members":members
    }
     
    )
  } catch (err) {
    next(err)
  }
})

//Change the status of a membership for a group specified by id
router.put("/:id/membership", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const coHost = await Membership.findOne({
      where: {
        groupId: group.id,
        memberId: req.user.id,
        status: "co-host"
      }
    })
    let coHostStatus = null;
    if (coHost) {
      coHostStatus = coHost.status
    }
    const member = await Membership.findOne({
      where: {
        groupId: group.id,
        memberId: req.body.memberId
      }
    });

    if (req.body.status === "pending") {
      next({
        message: "can not change status on pending",
        statusCode: 400
      })
    }

    if (!member) {
      next({
        message: "Member could not be found",
        statusCode: 404
      })
    }
    if (req.user.id !== group.organizerId && coHostStatus !== "co-host") {
      next({
        message: "only co-host or organizer can edit a group",
        statusCode: 403
      })
    }
    //change status on member
    if ((req.user.id === group.organizerId || coHostStatus === "co-host") && req.body.status === "member") {
      member.update({
        groupId: group.id,
        memberId: req.body.memberId,
        status: req.body.status
      })
      res.json(member)
    }

    //change status on co-host
    if (req.user.id === group.organizerId && req.body.status === "co-host") {


      member.update({
        groupById: group.id,
        memberId: req.body.memberId,
        status: req.body.status
      })
     const resObg={
      groupById: member.groupById,
      memberId: member.memberId,
      status:member.status,
      id:member.id
     }
      res.json(resObg)
    }
  } catch (err) {

    next(err)
  }


})











// //Create the status of a membership for a group specified by id ??? find membership - task 23
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
    const pending = await Membership.findOne({
      where: {
        groupId: group.id,
        memberId: userId,
        status: "pending"
      }
    })

    if (pending) {
      next({
        message: "Membership has already been requested",
        statusCode: 400
      })
    }

    const member = await Membership.findOne({
      where: {
        memberId: userId,
        groupId: group.id
      }
    })
    if (member) {
      next({
        message: "User is already a member of the group",
        statusCode: 400
      })
    }
    const newRequest = await Membership.create({
      groupId: group.id,
      memberId: userId,
      status: "pending"
    })

    const request = await Membership.scope("submission").findByPk(newRequest.id)


    res.status(201).json(
      request
    )
  } catch (err) {
    next(err)
  }
})

//Delete membership to a group specified by id

router.delete('/:id/membership',requireAuth, async (req, res, next) => {
  try {
    let group = await Group.findByPk(+req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const member = await Membership.findOne({
      where: {
        groupId: group.id,
        memberId: req.body.memberId
      }
    });
 
    if (!member) {
      next({
        message: "Member could not be found",
        statusCode: 404
      })
    }

    const coHost = await Membership.findOne({
      where: {
        groupId: group.id,
        memberId: req.user.id,
        status: "co-host"
      }
    })
    if (req.user.id !== group.organizerId && coHost.status !== "co-host") {
      next({
        message: "only co-host or organizer can delete a group",
        statusCode: 403
    })
  }
      await member.destroy()
      res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
  

  } catch (err) {
    next(err)

  }
})



// Get all Events of a Group specified by its id 
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
      subQuery: false,
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("numAttending.id")), "numAttending"],
          [sequelize.col("EventImages.url"), "previewImage"]
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
      if (!item.numAttending) {
        item.numAttending = 0
      }


      delete item.Location
      delete item.createdAt
      delete item.updatedAt
      delete item.locationId
      delete item.price
      delete item.capacity
      delete item.description
    })





    res.json({
      Events: list
    }

    )
  } catch (err) {
    next(err)
  }
})

//Create an Event for a Group specified by its id 

router.post("/:id/events", [requireAuth, validateEvents], async (req, res, next) => {

  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        message: "Group could not be found",
        statusCode: 404
      })
    }
    const coHost = await Membership.findAll({
      where: {
        groupId: req.params.id,
        memberId: req.user.id,
        status: "co-host"
      }
    })
    if (!coHost && req.user.id !== group.organizerId) {
      next({
        message: "Organizer or co-host can create an Event",
        statusCode: 403
      })
    }
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


  } catch (err) {
    next(err)
  }
})

module.exports = router;