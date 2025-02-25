import City from "../models/City.js";


const formatUserResponse = async (user) => {
  const city = await City.findById(user.address.city).select("name");
  return {
    name: user?.name,
    phone: user?.phone,
    birthdate: user?.birthdate,
    address: {
      city: city?.name,
      state: user?.address.state,
      descriptiveAddress: user?.address.descriptiveAddress,
    },
    secondaryPhone: user?.secondaryPhone,
  };
};

export default formatUserResponse;