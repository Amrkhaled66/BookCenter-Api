import Order from "../models/Order.js";

import Order from "../models/Order.js";

const formatOrders = async (orderHistory) => {
  try {
    const orderIds = orderHistory.map((order) => order.orderId.toString());

    const orders = await Order.find({ _id: { $in: orderIds } })
      .populate("products.product", "name")
      .populate("shippingAddress.city", "name")
      .select("-userId");

    return orders.filter(Boolean);
  } catch (err) {
    throw err;
  }
};


export default formatOrders;
