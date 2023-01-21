// backend/routes/api/groups.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group } = require("../../db/models");
const { json } = require('sequelize');

const { restoreUser } = require('../../utils/auth.js');




// ### Get all Groups
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll()
    console.log(groups)
    res.json({
      groups
    })

    return;


  } catch (err) {
    console.log(err)

  }
  return

})
router.use(restoreUser);

// // ### Get all Groups joined or organized by the Current User
router.use(restoreUser)
router.get("/auth", requireAuth, async(req, res)=>{
 console.log(restoreUser,1)
  try{
let groups = await Group.findAll()
console.log(groups)
res.json({
  groups
})
  }catch{
    
  }
})






// ### Get details of a Group from an id
router.get("/:id", async(req, res, next)=>{
  console.log(req.params.id)
  try{
const group = await Group.findByPk(req.params.id)  
console.log(group)  
if(!group){
  throw new Error(
    `Could not find group ${req.params.id}`
  )
}
res.json({
  group
})
  } catch(err){ 
    next({
      status: 404,
      message: `Could not find group ${req.params.id}`
    })
  }
})
//### Get details of a Group from an id  ?????(no images)
router.get("/:id/images", async(req, res, next)=>{
  try{
// const group = await Group.scope([
//   "withoutPreview",
//   { method: ["groupWithImages", req.params.id] }
// ]).findByPk(req.params.id)
const group = await Group.scope("withoutPreview").findByPk(req.params.id)
console.log(group)
if(!group){
  throw new Error(
    `Could not find group ${req.params.id}`
  )
}
res.json({
  group
})
  }catch(err){
    next({
      status: 404,
      message: `Could not find group ${req.params.id}`
    })
  }
})





module.exports = router;