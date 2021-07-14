const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // limits the amount of api calls in a set amount of time.

const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass"); // handles errors
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/user/userRouter");
const twilioRouter = require("./routes/twilio/twilioRouter"); // used
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

const limiter = rateLimit({ // limits api requests, even if its an incorrect path
  max: 20,
  windowMs: 1 * 60 * 1000, 
  message:
    "Too many requests from this IP, please try again or contact support", // error message displayed
});

app.use("/api", limiter); // using the limiter we created earlier

app.use(express.json());
//parsing form data/incoming data
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/twilio", twilioRouter);

app.all("*", function (req, res, next) { // sort of like a catch all 
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`,
      404
    )
  );
});

app.use(errorController); // a secondary catch 

module.exports = app;
