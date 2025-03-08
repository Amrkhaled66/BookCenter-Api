import User from "../models/User.js";

const fetchUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export default fetchUser;