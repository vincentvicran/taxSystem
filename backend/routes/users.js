const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

//* get request response
router.get(`/`, async (req, res) =>{
    const userList = await User.find();
    res.send(userList);
})


//* post request response
router.post(`/`, (req, res) =>{
    const user = new User({
        id: req.body.id,
        name: req.body.name,
        
    });
    user.save().then((createdUser => {
        res.status(201).json(createdUser)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;