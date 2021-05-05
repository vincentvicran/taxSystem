const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

//* get request response
//?for all users
router.get(`/`, async (req, res) =>{
    const userList = await User.find();
    res.send(userList);
})

//?for specific user
router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        res.status(500).json({message: 'The user is not found!'});
    }

    res.status(200).send(user);
})


//* post request response
router.post(`/`, async (req, res) =>{
    let user = new User({
        userId: req.body.userId,
        userRole: req.body.userRole,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userPassword: req.body.userPassword
    });
    
    user = await user.save();

    if(!user)
        return res.status(500).json({
            error: err,
            success: false,
            message: 'The user cannot be created!'
        });

    res.send(user);
})


//* update
router.put(`/:id`, async (req, res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            userId: req.body.userId,
            userRole: req.body.userRole,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDOB: req.body.userDOB,
            userAddress: req.body.userAddress,
            userPassword: req.body.userPassword
        },
        {
            new: true
        }
    );

    if(!user)
        return res.status(404).send('The user cannot be created!');

    res.send(user); 
})


//* delete request and response
router.delete(`/:id`, (req, res) => {
    User.findByIdAndRemove(req.params.id).then(User => {
        if(User){
            return res.status(200).json({success: true, message: 'The User is deleted!'});
        }
        else{
            return res.status(404).json({success: false, message: 'The User is not found!'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    })
})


module.exports = router;