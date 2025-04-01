import {
  createInvoice,
  updateUserInformation,
  prepareInvoiceData,
} from "../services//invoice.js";
import createOrder from "../services/createOrder.js";
import Order from "../models/Order.js";

import fetchUser from "../utils/fetchUser.js";
import { reserveStock } from "./stockRecordsController.js";

const createInvoiceController = async (req, res) => {
  try {
    const orderCart = req.body.cart;
    const deliveryInfo = req.body.deliveryInfo;
    const userId = req.user.id;
    
    const user = await fetchUser(userId);
    await updateUserInformation(user, deliveryInfo);

    const raw = await prepareInvoiceData(orderCart, deliveryInfo, user);
    const invoice = await createInvoice(raw);

    const isInvoiceExisted = await Order.findOne({
      invoiceId: invoice.invoiceId,
    });

    if (!isInvoiceExisted) {
      for (const item of orderCart) {
        const {
          productInfo: { id: productId },
          quantity,
        } = item;
        const reserveResult = await reserveStock(productId, quantity);
        if (!reserveResult.success) {
          throw new Error(reserveResult.message);
        }
      }

      await createOrder({
        deliveryInfo,
        orderCart,
        invoice,
        userId,
        total: raw.cartTotal,
        ShippingPrice: raw.shipping,
      });
    }

    res.status(200).json({
      invoice: invoice.url,
      message: "Invoice created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createInvoiceController };
