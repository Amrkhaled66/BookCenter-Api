const notFoundHandler = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next();
};

const errorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "An error occurred" });
};

export { notFoundHandler, errorHandler };
