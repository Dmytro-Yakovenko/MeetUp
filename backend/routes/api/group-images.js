const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { GroupImage, Group } = require('../../db/models');

const router = express.Router();

router.delete("/:id", requireAuth, async (req, res, next) => {

    try {

        const image = await GroupImage.findByPk(+req.params.id, {
            include:{
                model:Group,
                attributes:['organizerId']
            }
        });

        if (!image) {
            next({
                "message": "Group Image couldn't be found",
                "statusCode": 404
            })
        }
        // const group = await Group.findOne({
        //     where: {
        //         id: image.groupId
        //     }
        // });

        // const membership = await Membership.findOne({
        //     where: {
        //         groupId: image.groupId,
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

            // next({
            //     "message": "not enough rights",
            //     "statusCode": 403
            // })


        // }
        console.log(req.user.id)
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