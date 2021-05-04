const {Permission} = require('../models/permission');
const express = require('express');
const router = express.Router();

//* get request response
router.get(`/`, async (req, res) =>{
    const permissionList = await Permission.find();
    res.send(permissionList);
})


//* post request response
router.post(`/`, (req, res) =>{
    const permission = new Permission({
        id: req.body.id,
        name: req.body.name,
        
    });
    permission.save().then((createdPermission => {
        res.status(201).json(createdPermission)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;