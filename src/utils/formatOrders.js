import Order from "../models/Order.js";

const formatOrders = async (orderHistory) => {
  try {
    const userOrders = await Promise.all(
      orderHistory.map(async (order) => {
        const populatedOrder = await Order.findById(order.orderId.toString())
          .populate("products.product", "name")
          .populate("shippingAddress.city", "name")
          .select("-userId");

        const r = await Order.findById(order.orderId.toString());
        return populatedOrder;
      })
    );

    return userOrders.filter(Boolean);
  } catch (err) {
    throw err;
  }
};

export default formatOrders;
