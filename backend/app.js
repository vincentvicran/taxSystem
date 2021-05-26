const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//* environment variables
require('dotenv/config');

const api = process.env.API_URL;
// var authJwt = require('./helpers/jwt');
// var errorHandler = require('./helpers/error-handler');
const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controllers/errorController');

app.use(cors());
app.options('*', cors());

//* middleware
app.use(bodyParser.json());

//* HTTP loggers details
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// app.use(authJwt());
// app.use(errorHandler);

//* importing routes
const usersRoutes = require('./routes/users');
const vehiclesRoutes = require('./routes/vehicles');
const paymentsRoutes = require('./routes/payments');
const insurancesRoutes = require('./routes/insurances');

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/vehicles`, vehiclesRoutes);
app.use(`${api}/payments`, paymentsRoutes);
app.use(`${api}/insurances`, insurancesRoutes);

//* error handling
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Can't find ${req.originalUrl} on this server!`,
            404
        )
    );
});

app.use(globalErrorHandler);

//* database connection
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: 'TaxDB',
    })
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

//* starting the server
app.listen(5500, () => {
    console.log('Listening to http://localhost:5500');
});
