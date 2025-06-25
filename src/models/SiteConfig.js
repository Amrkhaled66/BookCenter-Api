import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    tiktok: {
      type: String,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Invalid WhatsApp number format"],
    },
    whatsappChannel: {
      type: String,
      trim: true,
    },
    shippingPriceCairoAndGiza: {
      type: Number,
      required: true,
      min: 0,
    },
    generalShippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    nextItemFees: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", siteConfigSchema);
