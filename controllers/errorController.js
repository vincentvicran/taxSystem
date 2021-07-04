const AppError = require('../helpers/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (error, res) => {
    //* Operational, trusted error: sent to client
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.error('ERROR 🛠', error);

        //* Programming or other unknown error: dont leak error details
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value; ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data ${errors.join(
        '. '
    )} Please use valid data!`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again!');

const handleJWTExpiredError = () =>
    new AppError('Your login token has expired. Please login again!');

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //! for development
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    //! for production
    else if (process.env.NODE_ENV === 'production') {
        let error = err;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
