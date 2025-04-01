import Product from "../models/Product.js";
import StockRecord from "../models/StockRecord.js";
const addToCart = async (req, res) => {
  const { id, quantity } = req.body;
  req.body;
  // Validate input data
  if (!id || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid Data" });
  }

  try {
    const stockRecord = await StockRecord.findOne({ productId: id });
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > stockRecord.inStock) {
      return res.status(400).json({
        message: "Product out of stock",
        inStock: stockRecord.inStock,
      });
    }

    res.status(200).json({
      message: "Product added to cart",
      product: {
        id,
        price: product.price,
        quantity,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { addToCart };
