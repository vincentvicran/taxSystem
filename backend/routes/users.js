const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//* get request response
//?for all users
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-userPassword');
    res.send(userList);
})

//?for specific user
router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-userPassword');

    if(!user) {
        res.status(500).json({message: 'The user is not found!'});
    }

    res.status(200).send(user);
})


//* post request response
router.post(`/`, async (req, res) =>{
    let user = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: bcrypt.hashSync(req.body.userPassword, 07),
        isAdmin: req.body.isAdmin
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

router.post('/login', async (req, res) => {
    const user = await User.findOne({userEmail: req.body.userEmail});
    const secret = process.env.secret;

    if(!user) {
        return res.status(400).send('The user does not exist!');
    }

    if(user && bcrypt.compareSync(req.body.userPassword, user.userPassword)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d'
            }
        )
        res.status(200).send({user: user.userEmail, token: token});
    }
    else {
        res.status(400).send('Wrong password!');
    }
})


router.post('/register', async (req,res)=>{
    let user = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: bcrypt.hashSync(req.body.userPassword, 07),
        isAdmin: req.body.isAdmin
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('The user cannot be created!')

    res.send(user);
})


//* update
router.put(`/:id`, async (req, res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDOB: req.body.userDOB,
            userAddress: req.body.userAddress,
            userContact: req.body.userContact,
            userPassword: req.body.userPassword,
            isAdmin: req.body.isAdmin
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

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false});
    } 
    res.send({
        userCount: userCount
    });
})


module.exports = router;