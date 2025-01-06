class ApiError extends Error {
    constructor(arg1, arg2) {
      let statusCode, message, errors = [], stack = "";
  
      // Handle direct arguments (statusCode, message)
      if (typeof arg1 === "number" && typeof arg2 === "string") {
        statusCode = arg1;
        message = arg2;
      }
      // Handle object argument
      else if (typeof arg1 === "object") {
        statusCode = arg1.statusCode;
        message = arg1.message || "Something went wrong here";
        errors = arg1.errors || [];
        stack = arg1.stack || "";
      }
      // Default case
      else {
        statusCode = 500;
        message = "Something went wrong here";
      }
  
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = errors;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export { ApiError };