const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    //wrong mongodb Id Error
    if(err.name === 'CastError'){
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    //Wrong JWT Error
    if(err.name === 'JsonWebTokenError'){
        const message = `Json Web Token Is Invalid, try again`;
        err = new ErrorHandler(message,400);
    }

    //JWT Expaire Error
    if(err.name === 'TokenExpairedError'){
        const message = `Json Web Token is Expaired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        error:err.message,
        // error:err.stack (it give the details path from which i getting error)
    });
}