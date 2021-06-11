const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message

        //Wrong Mongoose Object ID Error
        if(err.name === 'CastError'){
            const message = `No Resources Found. Invalid : ${err.path}`
            error = new ErrorHandler(message,400)
        }

        //Handling Mongoose Validation Error
        if(err.name === 'ValidationError'){
            const message = object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message,400)
        }

        //Handling Mongoose duplicate key Errors
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message,400)
        }

        //Handling Wrong JWT erros
        if(err.name === 'JsonWebTokenError'){
            const message = 'json web token is not valid. Try again.'
            error = new ErrorHandler(message,400)
        }
        
        //Handling Expired JWT erros
        if(err.name === 'TokenExpiredError'){
            const message = 'json web token has expired. Try again.'
            error = new ErrorHandler(message,400)
        }
        
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Severity Error'
        })
    }
}