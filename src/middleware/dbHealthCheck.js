import mongoose from "mongoose";

const dbHealthCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is currently unavailable. Please try again later.",
    });
  }
  next();
};

export default dbHealthCheck;
