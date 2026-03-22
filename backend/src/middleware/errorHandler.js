const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    status = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
  }

  // Mongoose Cast Error (Invalid ID)
  if (err.name === "CastError") {
    status = 404;
    message = `Resource not found. Invalid: ${err.path}`;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Your token has expired. Please log in again.";
  }

  // Send response
  res.status(status).json({
    success: false,
    message,
    // Only send stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorHandler;
