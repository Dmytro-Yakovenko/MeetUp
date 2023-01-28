const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { GroupImages, Group, Membership} = require('../../db/models');

const router = express.Router();

router.delete("/:id", [restoreUser, requireAuth], async (req, res , next)=>{
    try{
const image = await GroupImages.findByPk(req.params.id);
// console.log(req.user)
if(!image){
    next({
        "message": "Group Image couldn't be found",
        "statusCode": 404
    })
}
const group = await Group.findByPk(image.dataValues.groupId);
const membership = await Membership.findOne({
    where:{
        groupId:group.dataValues.id
    }
})
if(membership.dataValues.status!=="co-host" ||membership.dataValues.status!=="organaizer" ){
    next({
        "message": "Only the co-host or organizer may delete an image",
        "statusCode": 403
    })
}

await image.destroy()
res.json(  {
    "message": "Successfully deleted",
    "statusCode": 200
  })
    }catch(err){
        next(err)
    }
})






module.exports = router;