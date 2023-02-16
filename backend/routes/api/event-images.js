const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { EventImage, Event, Group} = require('../../db/models');

const router = express.Router();


//Delete an Image to a Event based on the Event's id ???addImage - task 30
router.delete("/:id",  requireAuth, async (req, res, next) => {
   
    try {

        const image = await EventImage.findByPk(+req.params.id)
     
      

        if (!image) {
            next({
                "message": "Event Image couldn't be found",
                "statusCode": 404
            })
        }
       console.log(image)
   

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
        if(+image.Group.organizerId!==+req.user.id){
            next({
                "message": "not enough rights",
                "statusCode": 403
            })
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