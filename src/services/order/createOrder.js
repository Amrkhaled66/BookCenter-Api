import Order from "../../models/Order.js";

const createOrder = async ({ deliveryInfo, orderCart, invoice, userId }) => {
  try {
    const orderInfo = {
      products: orderCart,
      productsPrice: invoice.cartTotal,
      shippingPrice: invoice.shipping,
      totalPrice: invoice.cartTotal + invoice.shipping,
      invoiceId: invoice.invoiceId,
      invoiceKey: invoice.invoiceKey,
      invoiceLink: url.invoiceLink,
      paymentStatus: "pending",
      shippingAddress: {
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        descriptiveAddress: deliveryInfo.address,
      },
      phone: deliveryInfo.phone,
      secondaryPhone: deliveryInfo.secondaryPhone,
    };
    const newOrder = new Order({
      userId,
      ...orderInfo,
    });
    await newOrder.save();

    await User.findByIdAndUpdate(
      id,
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
