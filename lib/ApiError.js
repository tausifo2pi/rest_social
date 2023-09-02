const { isObject, isString } = require("./isAnything");

class ApiError extends Error {
    constructor(errors, message = "Validation Error", statusCode = 400) {
      super(message);
      this.name = "CustomValidationError";
      this.errors = isObject(errors) ? errors : isString(errors) ? { message: errors.trim() } : {message: "Unknown error"};
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
      this.message = message
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ApiError;