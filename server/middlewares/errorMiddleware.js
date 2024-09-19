const sendErrorDev = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    errror: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

exports.globalErrorHandlingMiddleware = (err, req, res, next) => {
  process.env.NODE_ENV === "development"
    ? sendErrorDev(err, req, res)
    : sendErrorProd(err, req, res);
};
