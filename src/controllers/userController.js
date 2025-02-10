import User from "../models/User.js";
import Order from "../models/Order.js";

const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const userOrders = [];
    for (let order of user.orderHistory) {
      const foundedOrder = await Order.findById(
        order.orderId.toString()
      ).populate("products", "name");
      foundedOrder, order.orderId.toString();
      userOrders.push(foundedOrder);
    }

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

export { getProfileController, updateProfileController, getOrdersController };
