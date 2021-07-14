  
const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

function dispatchErrorDevelopment(error, req, res) { // if we are in development mode, the error will be formatted to look like this.
  if (req.originalUrl.startsWith("/api")) { // if the reqs original url starts with api (it should)
    return res.status(error.statusCode).json({  // error status code will return whatever it is (500/400/404, etc)
      status: error.status, 
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
}
function dispatchErrorProduction(error, req, res) { // if we are in production mode, the error will be formatted to look like this.
  if (req.originalUrl.startsWith("/api")) { // if the reqs original url starts with api (it should)
    if (error.isOperational) { // if the error is operational = true,
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    return res.status(error.statusCode).json({ // if there is an error in production mode, we dont show the errors to the users. we just ask them to contact us.
      status: "Error",
      message:
        "Something went wrong Please contact support 123-999-8888 or email us at xxx@mail.com",
    });
  }
}

//Solution 1
function handleMongoDBDuplicate(err) {
  console.log(err);
  let errorMessageDuplicateKey = Object.keys(err.keyValue)[0];
  let errorMessageDuplicateValue = Object.values(err.keyValue)[0];

  // console.log(errorMessageDuplicateKey);
  // console.log(errorMessageDuplicateValue);

  //we have parse some data in here
  let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`;
  return new ErrorMessageHandlerClass(message, 400);
}
//Solution 2
// function handleMongoDBDuplicate(err) {
//   //'E11000 duplicate key error collection: backend-api.users index: email_1 dup key: { email: "hamster@mail.com" }'
//   //' email: "hamster@mail.com" '
//   //' email  hamster@gmail.com '
//   //email hamster@gmail.com
//   //[email, hamster@gmail.com]

//   let errorMessage = err.message;

//   let findOpeningBracket = errorMessage.match(/{/).index;
//   let findClosingBracket = errorMessage.match(/}/).index;

//   let foundDuplicateValueString = errorMessage.slice(
//     findOpeningBracket + 1,
//     findClosingBracket
//   );

//   let newErrorString = foundDuplicateValueString.replace(/:|\"/g, "");
//   let trimmedNewErrorString = newErrorString.trim();

//   let errorStringArray = trimmedNewErrorString.split(" ");

//   let message = `${errorStringArray[0]} - ${errorStringArray[1]} is taken please choose another one`;
//   return new ErrorMessageHandlerClass(message, 400);
// }

module.exports = (err, req, res, next) => {
  // console.log(err);
  // console.log(err.message);
  // console.log("2");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("3");
  // console.log(err);
  let error = { ...err };
  // console.log("4");

  error.message = err.message;

  // console.log("5");
  // console.log(error);
  // console.log(error.message);
  // console.log("6");
  //console.log(error);
  if (error.code === 11000 || error.code === 11001) {
    error = handleMongoDBDuplicate(error);
  }

  console.log("7");
  console.log(error);
  if (process.env.NODE_ENV === "development") {
    dispatchErrorDevelopment(error, req, res);
  } else {
    dispatchErrorProduction(error, req, res);
  }
};
