import Order from "../models/Order.js";
import Product from "../models/Product.js"
const orderAnalytics = async (req, res) => {
  try {
    const [
      paidOrders,
      reservedOrders,
      expiredOrders,
      totalRevenue,
      orderCount,
      topSellingProducts,
    ] = await Promise.all([
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.countDocuments({ paymentStatus: "expired" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$createdAt", total: { $sum: "$totalPrice" } } },
        { $sort: { _id: 1 } },
      ]),
      Product.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "products.product",
            as: "orders",
          },
        },
        { $unwind: "$orders" },
        { $group: { _id: "$_id", totalSold: { $sum: "$orders.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const averageOrderValue = totalRevenue[0]?.total / paidOrders;

    res.json({
      paidOrders,
      reservedOrders,
      expiredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: averageOrderValue || 0,
      orderCount,
      topSellingProducts,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { orderAnalytics };
