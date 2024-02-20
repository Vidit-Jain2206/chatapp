export const NotFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(400);
  next(error);
};

export const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : req.statusCode;
  res.status(statusCode);
  res.json({
    msg: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
