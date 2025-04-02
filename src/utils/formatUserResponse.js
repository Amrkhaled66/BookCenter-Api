import City from "../models/City.js";

const formatUserResponse = async (user) => {
  try {
    if (!user) throw new Error("User object is required");

    const city = user.address?.city
      ? await City.findById(user.address.city).select("name")
      : null;

    return {
      name: user.name,
      phone: user.phone,
      birthdate: user.birthdate,
      address: {
        city: city?.name,
        state: user.address?.state,
        descriptiveAddress: user.address?.descriptiveAddress,
      },
      secondaryPhone: user.secondaryPhone,
    };
  } catch (error) {
    console.error("Error in formatUserResponse:", error.message);
    throw new Error("Failed to format user response");
  }
};

export default formatUserResponse;
