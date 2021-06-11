const app = require('./app')
const dotenv = require('dotenv')
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
