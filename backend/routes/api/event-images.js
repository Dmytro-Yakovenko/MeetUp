const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { EventImages, Event, Group, Membership} = require('../../db/models');

const router = express.Router();


//Delete an Image to a Event based on the Event's id ???addImage - task 30
router.delete("/event-images/:id",  requireAuth, async (req, res, next) => {
   
    try {
      const eventImage = await EventImages.findByPk(req.params.id,{
        include:{
            model:Event
        }
      });
    
      if (!eventImage) {
        next({
          message: "Event couldn't be found",
          status: 404
        })
      }
      const group = await Group.findOne({
        where:{
            id:event.groupId
        }
    });
   
    const membership = await Membership.findOne({
        where:{
            groupId:group.dataValues.id
        }
    })
  
    if(membership.dataValues.status==="co-host" ||membership.dataValues.status==="organaizer" ){
      await image.destroy()
      
        res.json(  {
            "message": "Successfully deleted",
            "statusCode": 200
    
            
          })
    }else{
      
          next({
            "message": "Only the co-host or organizer may delete an image",
            "statusCode": 403
        })
    }
      
    } catch (err) {
      next(err)
    }
  })
  
  


module.exports = router;