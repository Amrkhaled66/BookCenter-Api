// controllers/analyticsController.js
import Order from "../models/Order.js";
import User from "../models/User.js";

const getOrderCounts = () =>
  Promise.all([
    Order.countDocuments({ paymentStatus: "paid" }),
    Order.countDocuments({ paymentStatus: "pending" }),
    Order.countDocuments({ paymentStatus: "expired" }),
  ]);

const getOrderStatusOverTime = () =>
  Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          status: "$paymentStatus",
          deliveryStatus: "$deliveryStatus",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.date",
        statuses: {
          $push: {
            status: "$_id.status",
            deliveryStatus: "$_id.deliveryStatus",
            count: "$count",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

const getMonthlyRevenue = () =>
  Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 },
  ]);

const getAvgOrderValueByDay = () =>
  Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        avgOrderValue: { $avg: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

const getNewUsersPerDay = () =>
  User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

const getCustomerInsights = () =>
  Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalPrice" },
        avgOrderValue: { $avg: "$totalPrice" },
      },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        avgOrdersPerCustomer: { $avg: "$totalOrders" },
        avgCustomerValue: { $avg: "$totalSpent" },
      },
    },
  ]);

const orderAnalytics = async (req, res) => {
  try {
    const [
      [paidOrders, reservedOrders, expiredOrders],
      orderStatusOverTime,
      monthlyRevenue,
      averageOrderValueByDay,
      newUsersPerDay,
      customerInsightsRaw,
    ] = await Promise.all([
      getOrderCounts(),
      getOrderStatusOverTime(),
      getMonthlyRevenue(),
      getAvgOrderValueByDay(),
      getNewUsersPerDay(),
      getCustomerInsights(),
    ]);

    const statusMap = {};
    orderStatusOverTime.forEach((day) => {
      const date = day._id;
      statusMap[date] = { date, paid: 0, pending: 0, expired: 0, delivered: 0 };
      day.statuses.forEach(({ status, deliveryStatus, count }) => {
        if (status === "paid") statusMap[date].paid = count;
        if (status === "pending") statusMap[date].pending = count;
        if (status === "expired") statusMap[date].expired = count;
        if (deliveryStatus === "delivered") statusMap[date].delivered = count;
      });
    });

    const orderStatusPerDay = Object.values(statusMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.json({
      paidOrders,
      reservedOrders,
      expiredOrders,
      monthlyRevenue,
      averageOrderValueByDay,
      newUsersPerDay,
      orderStatusPerDay,
      totalOrders: paidOrders + reservedOrders + expiredOrders,
      customerInsights: customerInsightsRaw[0] || {
        totalCustomers: 0,
        avgOrdersPerCustomer: 0,
        avgCustomerValue: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "خطأ في الخادم",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export { orderAnalytics };
