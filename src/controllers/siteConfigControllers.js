import SiteConfig from "../models/SiteConfig.js";

// Update config
export async function updateSiteConfig(req, res) {
  try {
    const updateData = req.body;

    const updatedConfig = await SiteConfig.findOneAndUpdate(
      {}, // no filter – there's only one config
      updateData,
      { new: true, upsert: true } // create if not exist
    );

    res.status(200).json({ success: true, config: updatedConfig });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Get config
export async function getSiteConfig(req, res) {
  try {
    const config = await SiteConfig.findOne();

    if (!config) {
      return res
        .status(404)
        .json({ success: false, message: "Config not found" });
    }

    res.status(200).json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
