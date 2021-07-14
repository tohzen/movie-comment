const {
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
} = require("../../utils/authMethods"); // brings in the authmethods

function checkIsEmailFunc(req, res, next) {
  const { errorObj } = res.locals;

  if (!checkIsEmail(req.body.email)) { // checks the input box against the email format
    errorObj.wrongEmailFormat = "Must be in email format!";
  }

  next(); // if no error is found, continue
}

function checkIsAlphaFunc(req, res, next) { // checks the input boxes for first and last name against the format
  const { errorObj } = res.locals;
  const inComingData = req.body;
  for (key in inComingData) {
    if (key === "firstName" || key === "lastName") {
      if (!checkIsAlpha(inComingData[key])) {
        errorObj[`${key}`] = `${key} can only have characters`;
      }
    }
  }

  next(); // if no error is found, continue
}

function checkIsAlphanumericFunc(req, res, next) { // checks the username input box to see it matches the format
  const { errorObj } = res.locals;
  if (!checkIsAlphanumeric(req.body.username)) {
    errorObj.usernameError = "username can only have characters and numbers";
  }

  next(); // if no error is found, continue
}

module.exports = {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
};
