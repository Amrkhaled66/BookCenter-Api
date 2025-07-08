import Order from "../models/Order.js";
import City from "../models/City.js";
import User from "../models/User.js";
import SiteConfig from "../models/SiteConfig.js";

const createOrder = async ({
  deliveryInfo,
  orderCart,
  total,
  ShippingPrice,
  invoice,
  userId,
}) => {
  try {
    const products = orderCart.map((item) => {
      return {
        product: item.productInfo.id,
        quantity: item.quantity,
      };
    });

    const city = await City.findOne({ name: deliveryInfo.city });

    if (!city) throw new Error("city no found");

    
    
    const config = await SiteConfig.findOne();
    if (!config) throw new Error("Site config not found");
    
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + config.invoiceEndedHours);

    const orderInfo = {
      products,
      productsPrice: total,
      shippingPrice: ShippingPrice,
      totalPrice: ShippingPrice + total,
      invoiceId: invoice.invoiceId,
      invoiceKey: invoice.invoiceKey,
      invoiceLink: invoice.url,
      paymentStatus: "pending",
      shippingAddress: {
        city: city._id,
        state: deliveryInfo.state,
        descriptiveAddress: deliveryInfo.descriptiveAddress,
      },
      phone: deliveryInfo.firstPhone,
      secondaryPhone: deliveryInfo.secondPhone,
      expiredAt,
    };

    const newOrder = new Order({
      userId,
      ...orderInfo,
    });
    await newOrder.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { orderHistory: { orderId: newOrder._id } },
      },
      { new: true }
    );

    return newOrder;
  } catch (err) {
    throw err;
  }
};

export default createOrder;
