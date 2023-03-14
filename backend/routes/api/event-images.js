const express = require("express");

const { restoreUser, requireAuth } = require("../../utils/auth");
const { EventImage, Event, Group, Membership} = require("../../db/models");
const event = require("../../db/models/event");
const membership = require("../../db/models/membership");

const router = express.Router();


//Delete an Image to a Event based on the Event"s id ???addImage - task 30
router.delete("/:id",  requireAuth, async (req, res, next) => {
   
    try {

        const image = await EventImage.scope("exclusion").findByPk(+req.params.id)
     
      

        if (!image) {
            next({
                "message": "Event Image couldn't be found",
                "statusCode": 404
            })
            return
        }
     
        const event = await Event.findOne({
            where:{
                id:image.eventId
            }
        })
        const group = await Group.findOne({
            where:{
                id:event.groupId
            }
        })
        if(!group){
            next({
                "message": "Group couldn't be found",
                "statusCode": 404
            })
            return
        }


        const coHost = await Membership.findOne({
            where:{
                groupId:group.id,
                memberId:req.user.id, 
                status:"co-host"
            }
        })
        if(!coHost && req.user.id!==group.organizerId){
            next({
                "message": "Only co-host or organizer can delete event image ",
                "statusCode": 403
            })
            return
        }
   

      
       
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