import Order from "../models/Order.js";
import User from "../models/User.js";
const addOrderController = async (req, res) => {
  try {
    const id = req.user.id;
    const orderInfo = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      ...orderInfo,
    });
    await newOrder.save();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { orderHistory: { orderId: newOrder._id } },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Order added successfully", newOrder, updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { addOrderController };
