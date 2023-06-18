const app = require('./app')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')


// Handling Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to Uncaught Exceptions')
    process.exit(1)
})

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' })
}


// Connecting to database
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})


// Unhandled Promise rejection (Basically when the URI defined in the config is bad)
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to unhandled Promise rejection.')

    server.close(() => {
        process.exit(1)
    })
})