const getShippingCost = (req, res) => {
  let { city } = req.query;
  console.log(city)
  if (!city || city.trim() === "") {  
    return res.status(400).json({ message: "No city provided" });  
  }
  city = city.toLowerCase(); // Correctly using 'city' after modifying it
  let shippingPrice = city === "cairo" || city === "giza" ? 58 : 61;

  return res.status(200).json({ shippingPrice });
};

export default getShippingCost;
