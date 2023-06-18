const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        // useCreateIndex: true                 This option has been depriciated from Mongoose 6 version 
    }).then(data => {
        console.log(`MongoDB is connected with server: ${data.connection.host}`)
    })//.catch(err => console.log(err))         Catching error not required as server is closed on unhandled promise rejection in server.js file
}

module.exports = connectDatabase