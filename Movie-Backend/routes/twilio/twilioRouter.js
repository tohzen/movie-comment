const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware"); // requires the middleware for our token
const accountSid = process.env.TWILIO_ACCOUNT_SID; // env account number
const authToken = process.env.TWILIO_AUTH_TOKEN; // the api key stored in the env file
const client = require("twilio")(accountSid, authToken); // requires twilio and verifies our information 

router.post("/send-sms", jwtMiddleware, function (req, res) {
  client.messages
    .create({
      body: req.body.message,
      from: "+12402215541", //if you paid for the api service it will be your real number
      to: `+1${req.body.to}`, //and you can send real text message to your friends, family, and strangers... but dont do that
    })
    .then((message) => res.json(message))
    .catch((error) => {
      console.log(error.message);

      res.status(error.status).json({ message: error.message, error });
    });
});

module.exports = router;
