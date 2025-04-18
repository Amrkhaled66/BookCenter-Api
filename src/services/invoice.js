import User from "../models/User.js";
import City from "../models/City.js";
import {
  getOrderCart,
  getOrderTotal,
  getShippingPrice,
} from "../services/cart/getOrderCart.js";

import axios from "axios";

import { INVOICE_EXPIRATION_TIME } from "./defaultSettings.js";
export const updateUserInformation = async (user, deliveryInfo) => {
  const updateData = {};
  if (!user.secondaryPhone && deliveryInfo.secondPhone) {
    updateData.secondaryPhone = deliveryInfo.secondPhone;
  }

  if (!user.address.city && deliveryInfo.city) {
    const city = await City.findOne({ name: deliveryInfo.city });
    if (city) {
      updateData.address = {
        city: city._id,
        state: deliveryInfo.state,
        descriptiveAddress: deliveryInfo.descriptiveAddress,
      };
    }
  }

  if (Object.keys(updateData).length > 0) {
    await User.updateOne({ _id: user._id }, { $set: updateData });
  }

  return {
    ...updateData,
    address: {
      city: deliveryInfo.city,
      state: deliveryInfo.state,
      descriptiveAddress: deliveryInfo.descriptiveAddress,
    },
  };
};

export const prepareInvoiceData = async (orderCart, deliveryInfo, user) => {
  const cartItems = await getOrderCart(orderCart);
  const total = await getOrderTotal(orderCart);
  const ShippingPrice = getShippingPrice(deliveryInfo.city);

  const date = new Date();
  date.setHours(date.getHours() + INVOICE_EXPIRATION_TIME);
  const nextDay = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return {
    cartItems,
    cartTotal: total,
    shipping: ShippingPrice,
    customer: {
      first_name: user.name.split(" ")[0],
      last_name: user.name.split(" ").slice(1).join(" "),
      phone: user.phone,
      address: deliveryInfo.address,
    },
    currency: "EGP",
    sendSMS: true,
    due_date: nextDay,
  };
};

export const createInvoice = async (invoiceData) => {
  try {
    const { data } = await axios.post(process.env.FAWATERK_URL, invoiceData, {
      headers: {
        Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    console.error("Fawaterk API Error:", error.response?.data || error.message);
    throw new Error("Failed to create invoice");
  }
};
