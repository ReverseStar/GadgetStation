const express = require('express')
const app = express()
const errorMiddleware = require('./middleware/errors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

// Importing all Routes
const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)

// Middleware for handling errors
app.use(errorMiddleware)

module.exports = app
