import Product from "../models/Product.js";
import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}${file.originalname}`);
  },
});

const upload = multer({ storage: multerStorage });

const getAllProducts = async (req, res) => {
  try {
    const { limit, subject, year, seller } = req.query;
    const matchStage = { visible: true };

    if (subject) matchStage.subject = new mongoose.Types.ObjectId(subject);
    if (year) matchStage.year = year;
    if (seller) matchStage.seller = new mongoose.Types.ObjectId(seller);

    const products = await Product.aggregate([
      { $match: matchStage },
      { $sort: { priority: -1 } },

      {
        $lookup: {
          from: "sellers",
          localField: "seller",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      { $unwind: { path: "$sellerDetails", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subjectDetails",
        },
      },
      {
        $unwind: { path: "$subjectDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $group: {
          _id: "$category",
          products: {
            $push: {
              _id: "$_id",
              name: "$name",
              skuCode: "$skuCode",
              description: "$description",
              price: "$price",
              discountPrice: "$discountPrice",
              inStock: "$inStock",
              year: "$year",
              priority: "$priority",
              image: "$image",
              items: "$items",
              visible: "$visible",
              isUnAvailable: "$isUnAvailable",
              unAvailabilityNote: "$unAvailabilityNote",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              seller: {
                _id: "$sellerDetails._id",
                name: "$sellerDetails.name",
              },
              subject: {
                _id: "$subjectDetails._id",
                name: "$subjectDetails.name",
              },
            },
          },
        },
      },

      // Apply limit per category if specified
      {
        $project: {
          category: "$_id",
          products: limit
            ? { $slice: ["$products", parseInt(limit)] }
            : "$products",
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },

      {
        $project: {
          category: "$categoryDetails.name",
          products: 1,
        },
      },
    ]);

    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOptions = async (req, res) => {
  try {
    let { category } = req.query;

    if (!category || category === "undefined") {
      category = null;
    }
    const filter = category ? { category } : {};

    const products = await Product.find(filter, { _id: 1, name: 1 });

    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("seller", "name")
      .populate("category", "name")
      .populate("subject", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const image = req.file ? req.file.path : null;
    const items = req.body.items ? JSON.parse(req.body.items) : [];
    const product = new Product({ ...req.body, image, items });

    const newProduct = await product.save();

    if (!newProduct) {
      return res.status(400).json({ message: "There is an error" });
    }

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const image = req.file ? req.file.path : null;
    const items = req.body.items ? JSON.parse(req.body.items) : [];

    // 1️⃣ Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ If new image uploaded, delete the old one
    if (image && existingProduct.image) {
      const oldImagePath = path.resolve(existingProduct.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    // 3️⃣ Prepare new fields
    const newFields = {
      ...req.body,
      items,
      ...(image && { image }), // Only update image if new one exists
    };

    // 4️⃣ Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: newFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.imageUrl) {
      fs.unlink(product.imageUrl, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  upload,
  getOptions,
};
