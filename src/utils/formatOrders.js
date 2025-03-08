import Order from "../models/Order.js";

const formatOrders = async (orderHistory) => {
  let userOrders = [];
  for (let order of orderHistory) {
    const foundedOrder = await Order.findById(order.orderId.toString())
      .populate("products.product", "name")
      .select("-userId");

    foundedOrder && userOrders.push(foundedOrder);
  }
  return userOrders;
};

export default formatOrders;
