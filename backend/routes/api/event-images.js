const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { EventImages, Event, Group, Membership} = require('../../db/models');

const router = express.Router();


//Delete an Image to a Event based on the Event's id ???addImage - task 30
router.delete("/:id",  requireAuth, async (req, res, next) => {
   
    try {

        const image = await EventImages.findByPk(+req.params.id);

        if (!image) {
            next({
                "message": "Event Image couldn't be found",
                "statusCode": 404
            })
        }
        // const group = await Group.findOne({
        //     where: {
        //         id: image.groupId
        //     }
        // });
        const event = await Event.findByPk(image.eventId)

        if(!event){
            next({
                "message": "Event  couldn't be found",
                "statusCode": 404
            })
        }

        // const membership = await Membership.findOne({
        //     where: {
        //         groupId: event.groupId,
        //         userId: +req.user.id
        //     }
        // })
        // if (!membership) {
        //     next({
        //         "message": "not enough rights",
        //         "statusCode": 403
        //     })
        // }
        // if (membership.status !== "co-host" && membership.status !== "organaizer") {

        //     next({
        //         "message": "not enough rights",
        //         "statusCode": 403
        //     })


        // }

        await image.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
   
    } catch (err) {
        next(err)
    }
  })
  
  


module.exports = router;