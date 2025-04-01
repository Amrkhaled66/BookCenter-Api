import Order from "../models/Order.js";
import User from "../models/User.js";
const addOrderController = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Order added successfully", newOrder, updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getExpiredOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments({
      paymentStatus: "pending",
      expiredAt: { $lt: new Date() },
    });
    return res.status(200).json({ count });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export { addOrderController, getExpiredOrders };
