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

//* get request response
app.get(`${api}/products`, (req, res) =>{
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url',
    }

    res.send(product);
})


//* post request response
app.post(`${api}/products`, (req, res) =>{
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
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