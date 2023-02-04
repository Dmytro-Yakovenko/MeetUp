const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { GroupImages, Group, Membership } = require('../../db/models');

const router = express.Router();

router.delete("/:id", [restoreUser, requireAuth], async (req, res, next) => {

    try {

        const image = await GroupImages.findByPk(+req.params.id);

        if (!image) {
            next({
                "message": "Group Image couldn't be found",
                "statusCode": 404
            })
        }
        // const group = await Group.findOne({
        //     where: {
        //         id: image.GroupId
        //     }
        // });

        // const membership = await Membership.findOne({
        //     where: {
        //         GroupId: image.GroupId,
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