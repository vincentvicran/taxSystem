const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');



//* middleware
app.use(bodyParser.json());

//* HTTP loggers details
app.use(morgan('tiny'));

//* environment variables
require('dotenv/config');

const api = process.env.API_URL;


const Product = require('../models/user');

//* get request response
app.get(`${api}/users`, async (req, res) =>{
    const userList = await User.find();
    res.send(userList);
})


//* post request response
app.post(`${api}/users`, (req, res) =>{
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


//* database connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'TaxDB'
})
.then(() => {
    console.log('Database Connection is ready...')
})
.catch((err) => {
    console.log(err);
})


//* starting the server
app.listen(5500, ()=>{
    console.log(api);
    console.log('server is running at http://localhost:5500');
})