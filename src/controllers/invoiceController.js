import User from "../models/User.js";
import { createInvoice } from "../services/invoice/fawaterkService.js";

import {
  getOrderCart,
  getOrderTotal,
  getShippingPrice as getShippingPrice,
} from "../services/cart/getOrderCart.js";

import createOrder from "../services/order/createOrder.js";
const createInvoiceController = async (req, res) => {
  try {
    console.log(req.body);
    const orderCart = req.body.cart;
    const deliveryInfo = req.body.deliveryInfo;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = getOrderCart(orderCart);
    const total = getOrderTotal(orderCart);
    const ShippingPrice = getShippingPrice(deliveryInfo.city);


    const raw = {
      cartItems,
      cartTotal: total,
      shipping: ShippingPrice,
      customer: {
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        address: deliveryInfo.address,
      },
      currency: "EGP",
      sendSMS: true,
    };

    const invoice = await createInvoice(raw);
    await createOrder({
      deliveryInfo,
      orderCart: req.body.cart,
      invoice,
      userId,
    });

    res
      .status(200)
      .json({ invoice: invoice.url, message: "Invoice created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createInvoiceController };
