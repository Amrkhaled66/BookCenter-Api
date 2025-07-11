import Order from "../models/Order.js";
import StockRecord from "../models/StockRecord.js";

const releaseReservedStock = async () => {
  try {
    const batchSize = 100; 
    let skip = 0;
    let hasMoreOrders = true;

    // Loop to process orders in batches
    while (hasMoreOrders) {
      const expiredOrders = await Order.find({
        paymentStatus: "pending",
        expiredAt: { $lt: new Date() },
      })
        .skip(skip) // Skip previous batch
        .limit(batchSize) // Limit to 100 orders per batch
        .lean();

      if (expiredOrders.length === 0) {
        hasMoreOrders = false; // Stop the loop if no more orders are found
        console.log("✅ All expired orders processed");
        return;
      }

      const orderIds = expiredOrders.map((order) => order._id);
      console.log(`🔁 Processing ${orderIds} orders...`);
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

      await Promise.all([
        stockUpdates.length
          ? StockRecord.bulkWrite(stockUpdates)
          : Promise.resolve(),
        Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { paymentStatus: "expired", lastProcessedAt: new Date() } } // Set `lastProcessedAt`
        ),
      ]);

      // Move to the next batch
      skip += batchSize;
      console.log(`🔁 Processed ${skip} orders`);
    }
  } catch (error) {
    console.error("❌ Error in releaseReservedStock:", error);
  }
};

export default releaseReservedStock;
