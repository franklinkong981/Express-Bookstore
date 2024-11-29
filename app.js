/** Express app for bookstore. */

const express = require("express");
const morgan = require("morgan");

const ExpressError = require("./expressError");

const bookRoutes = require("./routes/books");

//Initialize app
const app = express();

// allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Use middleware logging function and prevent printing favicon.ico error to terminal
app.use(morgan('dev'));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

/* Routes */
app.use("/books", bookRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


/** general error handler */

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});


module.exports = app;
