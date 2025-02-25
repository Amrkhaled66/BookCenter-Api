import City from "../models/City.js";

const formatUserResponse = async (user) => {
  try {
    let cityName = null;
    
    if (user.address?.city) {
      const city = await City.findById(user.address.city).select("name");
      cityName = city ? city.name : "Unknown"; // Fallback in case city is not found
    }

    return {
      name: user?.name,
      phone: user?.phone,
      birthdate: user?.birthdate,
      address: {
        city: cityName,
        state: user?.address?.state || "Unknown", // Fallback if state is missing
        descriptiveAddress: user?.address?.descriptiveAddress || "Not provided",
      },
      secondaryPhone: user?.secondaryPhone || "Not provided",
    };
  } catch (error) {
    console.error("Error in formatUserResponse:", error);
    throw new Error("Failed to format user response");
  }
};

export default formatUserResponse;
