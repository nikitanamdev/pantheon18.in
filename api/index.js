const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

/**
 * Database connectivity
 */
const vpsurl = "mongodb://localhost:43928/pantheon";
const localurl = "mongodb://127.0.0.1/pantheon"
mongoose
    .connect(vpsurl, { useNewUrlParser: true }, (err, db) =>{
        if(err){
            console.log(err);
            console.log("Database Connectivity Error!!");
        } else {
            console.log("Database Connectivity Successfull!");
        }
    })
mongoose.Promise = global.Promise;


/**
 * Using MiddleWares
 */
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// handling cors errors
app.use(cors());


/**
 * Routes
 */
const rootRoutes = require('./routes/register.js');

app.use('/api', rootRoutes);




// Handling the errors
/**
 * If none of the above middlewares are hit there is definately an error
 */
app.use((req, res, next) => {
    // create a new error object(inbuilt)
    const error = new Error("Not Found!!");
    error.status = 404;
    // call the universal error handler and pass it to the next middleware this error
    // Till here it was sure that a wrong url has been hit. 
    next(error);
});

/**
 * Handling universal errors like dberror or server error etc
 * we'll have a error function from the previous middleware || from the universal error
 * This route is bound to hit
 */
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        "error": {
            "message": error.message
        }
    });
});



// get the port no.
const port = 5000 || process.env.PORT;

app.listen(port, "localhost", ()=>{
    console.log("Server running at port " + port);
});