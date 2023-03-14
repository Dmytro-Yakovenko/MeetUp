const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { GroupImage, Group, Membership } = require("../../db/models");

const router = express.Router();

router.delete("/:id", requireAuth, async (req, res, next) => {

    try {

      const image =await GroupImage.scope("exclusion").findByPk(req.params.id);


        if (!image) {
            next({
                "message": "Group Image couldn't be found",
                "statusCode": 404
                
            })
            return
        }
        
        const group = await Group.findOne({
            where: {
                id: image.groupId
            }
        });
        if (!group) {
            next({
                "message": "Group  couldn't be found",
                "statusCode": 404
                
            })
            return
        }
        const member = await Membership.findOne({
            where: {
                groupId:group.id,
                memberId:req.user.id,
                status:"co-host"
            }
        })
        if (!member && req.user.id!==group.organizerId) {
            next({
                "message": "not enough rights",
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