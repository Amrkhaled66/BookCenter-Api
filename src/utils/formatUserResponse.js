import City from "../models/City.js";

const formatUserResponse = async (user) => {
  try {
    if (!user) throw new Error("User object is required");

    const city = user.address?.city 
      ? await City.findById(user.address.city).select("name")
      : null;

    return {
      name: user.name || "Unknown",
      phone: user.phone || "Unknown",
      birthdate: user.birthdate || "Unknown",
      address: {
        city: city?.name || "Unknown",
        state: user.address?.state || "Unknown",
        descriptiveAddress: user.address?.descriptiveAddress || "Not provided",
      },
      secondaryPhone: user.secondaryPhone || "Not provided",
    };
  } catch (error) {
    console.error("Error in formatUserResponse:", error.message);
    throw new Error("Failed to format user response");
  }
};

export default formatUserResponse;
