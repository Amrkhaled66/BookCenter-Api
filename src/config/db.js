import mongoose from "mongoose";

const connectDB = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (err) {
    const dbError = new Error(
      "Unable to connect to the database. Please try again later."
    );
    dbError.statusCode = 500;
    throw { err, dbError };
  }
};

export default connectDB;
