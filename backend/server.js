const app = require('./app')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary')
const connectDatabase = require('./config/database')

//Handling Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log(`Error Occured: ${err.stack}`);
    console.log('Server is Shutting Down due to Uncaught Exception');
    process.exit(1)
})

//Setting up config files
dotenv.config({ path: 'backend/config/config.env' })


//Connecting to Database
connectDatabase()

//Cloudinary Config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on Port : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

//Handling Unhandled Promise Rejections
process.on('unhandledRejection', err => {
    console.log(`Error Occured: ${err.message}`)
    console.log('Server is Shutting Down due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1)
    })
})
