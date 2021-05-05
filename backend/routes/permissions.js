const {Permission} = require('../models/permission');
const express = require('express');
const router = express.Router();

//* get request response
//? for all the lists
router.get(`/`, async (req, res) =>{
    const permissionList = await Permission.find();

    if(!permissionList) {
        res.status(500).json({
            success: false
        })
    }
    res.status(200).send(permissionList);
})

//?for specific permission
router.get(`/:id`, async (req, res) => {
    const permission = await Permission.findById(req.params.id);

    if(!permission) {
        res.status(500).json({message: 'The permission is not found!'});
    }

    res.status(200).send(permission);
})


//* post request response
router.post(`/`, async (req, res) =>{
    let permission = new Permission({
        permissionId: req.body.permissionId,
        permissionRoleId: req.body.permissionRoleId,
        permissionTitle: req.body.permissionTitle        
    });

    permission = await permission.save();

    if(!permission)
        return res.status(404).send('The permission cannot be created!');

    res.send(permission); 
})

//* update
router.put(`/:id`, async (req, res)=>{
    const permission = await Permission.findByIdAndUpdate(
        req.params.id,
        {
            permissionId: req.body.permissionId,
            permissionRoleId: req.body.permissionRoleId,
            permissionTitle: req.body.permissionTitle 
        },
        {
            new: true
        }
    );

    if(!permission)
        return res.status(404).send('The permission cannot be created!');

    res.send(permission); 
})


//* delete request and response
router.delete(`/:id`, (req, res) => {
    Permission.findByIdAndRemove(req.params.id).then(permission => {
        if(permission){
            return res.status(200).json({success: true, message: 'The permission is deleted!'});
        }
        else{
            return res.status(404).json({success: false, message: 'The permission is not found!'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    })
})


module.exports = router;