import Product from "../models/product.js";

import multer from "multer";
import { v4 as uuid } from "uuid";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}${file.originalname}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

const getAllProducts = async (req, res) => {
  try {
    const fetchedProducts = await Product.find();
    const response = {
      count: fetchedProducts.length,
      products: fetchedProducts.map((product) => {
        return {
          ...product._doc,
        };
      }),
    };
    res.status(200).json({
      response,
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
      res.status(200).json({
        message: "Product Detail",
        product: product,
      });
    } else {
      res.status(200).json({ message: "not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    if (newProduct) {
      res.status(200).json({
        message: "Product added successfully",
        product: {
          ...newProduct._doc,
          productImage: req.file ? req.file.path : null,
        },
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      updatedProduct,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  upload,
};
