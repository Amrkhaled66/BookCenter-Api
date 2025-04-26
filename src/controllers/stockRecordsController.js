import StockRecord from "../models/StockRecord.js";
import nodemailer from "nodemailer";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const reserveStock = async (productId, quantity) => {
  try {
    const stockRecord = await StockRecord.findOne({ productId });
    const product = await Product.findById(productId);

    if (!stockRecord) {
      throw new Error("Stock record not found");
    }

    if (stockRecord.inStock < quantity) {
      throw new Error("Not enough stock available");
    }

  
    stockRecord.inStock -= quantity;
    stockRecord.reservedStock += quantity;
    stockRecord.totalReserved += quantity;

    product.totalOrders += 1;
    product.totalReserved += quantity;

    await stockRecord.save();
    await product.save();

    return { success: true, message: "Stock reserved successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const deductReservedStock = async (productId, quantity) => {
  try {
    const stockRecord = await StockRecord.findOne({ productId });
    const product = await Product.findById(productId);

    if (!stockRecord) {
      throw new Error("Stock record not found");
    }

    const remainingQuantity = Math.max(quantity - stockRecord.reservedStock, 0);

    stockRecord.reservedStock = Math.max(
      stockRecord.reservedStock - quantity,
      0
    );

    if (remainingQuantity > 0) {
      if (stockRecord.inStock >= remainingQuantity) {
        stockRecord.inStock -= remainingQuantity;
      } else {
        stockRecord.inStock = 0;
        stockRecord.reservedStock = 0;
      }
    }

    product.totalPaid += quantity;
    await stockRecord.save();
    await product.save();

    return { success: true, message: "Stock deducted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const moveReservedToInStock = async (productId, quantity) => {
  try {
    const stockRecord = await StockRecord.findOne({ productId });

    if (!stockRecord) {
      throw new Error("Stock record not found");
    }

    if (stockRecord.reservedStock < quantity) {
      throw new Error("Not enough reserved stock to move");
    }

    stockRecord.reservedStock -= quantity;
    stockRecord.inStock += quantity;

    await stockRecord.save();

    return {
      success: true,
      message: "Reserved stock moved to available stock",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const addStock = async (req, res) => {
  try {
    const { chosenProduct: productId, quantity, note, type } = req.body;

    const stockRecord = await StockRecord.findOne({ productId });

    if (!stockRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Stock record not found" });
    }

    stockRecord.inStock += parseInt(quantity);
    stockRecord.totalStockAdded += parseInt(quantity);

    stockRecord.stockHistory.push({
      note,
      type,
      quantity,
    });

    await stockRecord.save();

    return res
      .status(200)
      .json({ success: true, message: "Stock added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const notifyAdminForLowStock = async (productId) => {
  try {
    const stockRecord = await StockRecord.findOne({ productId }).populate(
      "productId",
      "name"
    );

    if (!stockRecord) {
      throw new Error("Stock record not found");
    }

    if (stockRecord.inStock > 10) {
      return { success: false, message: "Stock level is sufficient" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Low Stock Alert 🚨",
      text: `The stock for "${stockRecord.productId.name}" is low. Only ${stockRecord.inStock} items left.`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Admin notified for low stock" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const checkAndAdjustStock = async (req, res) => {
  try {
    const cart = req.body;

    const updatedCart = [];
    for (const item of cart) {
      const {
        productInfo: { id: productId },
        quantity,
      } = item;
      const stockRecord = await StockRecord.findOne({ productId });

      if (!stockRecord) {
        return res.status(404).json({
          error: `Stock record not found for product ID: ${productId}`,
        });
      }

      if (stockRecord.inStock < quantity) {
        item.quantity = stockRecord.inStock;
      }

      updatedCart.push(item);
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockRecordById = async (req, res) => {
  try {
    const { id: productId } = req.params;

    const stockRecord = await StockRecord.findOne({ productId });

    if (!stockRecord) {
      return res.status(404).json({ message: "Stock record not found" });
    }
    res.status(200).json(stockRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const releaseReservedStock = async (req, res) => {
  try {
    // 1. Find expired orders with lean() for better performance
    const expiredOrders = await Order.find({
      paymentStatus: "pending",
      expiredAt: { $lt: new Date() },
    }).lean();

    if (!expiredOrders.length) {
      return res.status(200).json({
        success: true,
        message: "No expired orders found",
      });
    }

    // 2. Prepare all operations in parallel
    const orderIds = expiredOrders.map((order) => order._id);

    const stockUpdates = expiredOrders.flatMap((order) =>
      order.products.map((item) => ({
        updateOne: {
          filter: { productId: item.product },
          update: {
            $inc: {
              reservedStock: -item.quantity,
              inStock: item.quantity,
            },
          },
        },
      }))
    );

    // 3. Execute all updates in parallel using Promise.all
    await Promise.all([
      stockUpdates.length
        ? StockRecord.bulkWrite(stockUpdates)
        : Promise.resolve(),
      Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { paymentStatus: "expired" } }
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: `${expiredOrders.length} orders processed. Reserved stock released.`,
    });
  } catch (error) {
    console.error("Error in releaseReservedStock:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  reserveStock,
  deductReservedStock,
  releaseReservedStock,
  moveReservedToInStock,
  addStock,
  notifyAdminForLowStock,
  checkAndAdjustStock,
  getStockRecordById,
};

// User places an order → reserveStock()
// Payment succeeds → deductReservedStock()
// Payment fails/expires → releaseReservedStock()
