import mongoose from "mongoose";

const connectDB = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    const dbError = new Error(
      "Unable to connect to the database. Please try again later."
    );
    dbError.statusCode = 500;
    throw dbError;
  }
};

export default connectDB;
