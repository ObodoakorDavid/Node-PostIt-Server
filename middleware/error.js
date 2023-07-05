/** @format */

const errorHandlerMiddleware = (error, req, res, next) => {
  if (error) {
    if (error.code === 11000 && error.keyValue.email) {
      error.message = `User with this email already exists`;
      error.statusCode = 400;
    } else if (error.code === 11000 && error.keyValue.username) {
      error.message = `User with this username already exists`;
      error.statusCode = 400;
    }

    if (!error.message) {
      error.message = "Something went wrong, try again later";
      error.statusCode = 500;
    }
    // console.log(err);
    // console.log(err.statusCode);
    // console.log('kk');
    return res.status(error.statusCode).json({ message: error.message });
  }
};

module.exports = errorHandlerMiddleware;
