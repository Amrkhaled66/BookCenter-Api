import SiteConfig from "../models/SiteConfig.js";

const getShippingPrice = async (city) => {
  if (!city || city.trim() === "") {
    return res.status(400).json({ message: "No city provided" });
  }

  const config = await SiteConfig.findOne();
  if (!config) {
    return res.status(500).json({ message: "Site config not found" });
  }
  city = city.toLowerCase();
  const shippingPrice =
    city === "cairo" || city === "giza"
      ? config.shippingPriceCairoAndGiza
      : config.generalShippingPrice;

  return shippingPrice;
};

export default getShippingPrice;
