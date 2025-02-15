import City from "../models/City.js";

const getCities = async (req, res) => {
  try {
    const cities = await City.find().select("name");
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getCityStates = async (req, res) => {
  try {
    const cityId = req.query?.cityId;

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: "City is not found" });
    }
    return res.status(200).json(city.get("states"));
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addCity = async (req, res) => {
  try {
    const existingCity = await City.findOne({ name: req.body.name });
    if (existingCity) {
      res.status(409).json({ message: "City already exists" });
    }

    const newCity = new City(req.body);

    await newCity.save();

    res.status(200).json({ message: "City added successfully", newCity });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addStatesToCity = async (req, res) => {
  try {
    // Ensure req.body is an array
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be a non-empty array" });
    }

    // Process each city and collect results/errors
    const results = await Promise.all(
      req.body.map(async (m) => {
        try {
          // Check if the city already exists
          const city = await City.findOne({ name: m.name });

          if (city) {
            return { success: false, message: "City already exists", city };
          }

          // If city doesn't exist, create and save a new one
          const newCity = new City(m);
          await newCity.save();
          return { success: true, city: newCity };
        } catch (err) {
          return { success: false, error: err.message, cityData: m };
        }
      })
    );

    // Filter out failed inserts
    const failed = results.filter((r) => !r.success);
    const successful = results.filter((r) => r.success);

    if (failed.length > 0) {
      return res.status(207).json({
        message: "Some cities failed to add",
        successful,
        failed,
      });
    }

    res
      .status(200)
      .json({ message: "All cities added successfully", successful });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getCities, getCityStates, addCity, addStatesToCity };
