const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');


//* environment variables 
require('dotenv/config');

const api = process.env.API_URL;
var authJwt = require('./helpers/jwt');
var errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

//* middleware
app.use(bodyParser.json());

//* HTTP loggers details
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);



//* importing routes
const usersRoutes = require('./routes/users');
const permissionsRoutes = require('./routes/permissions');
const vehiclesRoutes = require('./routes/vehicles');
const paymentsRoutes = require('./routes/payments');
const insurancesRoutes = require('./routes/insurances');


app.use(`${api}/users`, usersRoutes);
app.use(`${api}/permissions`, permissionsRoutes);
app.use(`${api}/vehicles`, vehiclesRoutes);
app.use(`${api}/payments`, paymentsRoutes);
app.use(`${api}/insurances`, insurancesRoutes);



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
app.listen(5500, ()=> {
    console.log(api);
    console.log('server is running at http://localhost:5500');
})