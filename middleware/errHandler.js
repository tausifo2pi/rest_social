const ApiError = require("../lib/ApiError");


module.exports = (err, req, res, next) => {
    console.log(err);

    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    // Handle MongoDB/Mongoose errors
    if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 409;
        status = 'fail';
        const field = Object.keys(err.keyValue)[0];
        err = new ApiError({ [field]: "already exists" }, message = "Validation Error", statusCode);
    }

    else if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = err.errors;
        Object.keys(errors).forEach((key) => {
            errors[key] = errors[key].message;
        });

        err = new ApiError(errors, message = "Validation Error", statusCode);
    }


    //mongodb data type error
    else if (err.name === 'CastError') {
        statusCode = 400;
        err = new ApiError({ [err.path]: `Invalid ${err.kind}` }, message = "Validation Error", statusCode);
    }


    // Handle ApiErrors
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors,
        });
    } else {
        // Log unknown errors
        res.status(statusCode).json({
            status,
            message: 'Something went wrong',
        });
    }
};