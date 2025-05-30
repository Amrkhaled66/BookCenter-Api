import Order from "../models/Order.js";
import ManualOrder from "../models/ManualOrder.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import City from "../models/City.js";
import getShippingCost from "./shippingController.js";
/**
 * Creates a manual order for existing users identified by phone number
 * Supports reverse orders, damage orders, and paid orders
 */
const addManualOrder = async (req, res) => {
  try {
    const { phoneNumber, type, note, parentOrder, orderCart } = req.body;

    // Validate required input
    if (
      !phoneNumber ||
      !type ||
      !Array.isArray(orderCart) ||
      orderCart.length === 0
    ) {
      return res.status(400).json({
        error: "Missing required fields: phoneNumber, type, or orderCart",
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(404).json({
        error: "User not found with the provided phone number",
      });
    }

    // Process order
    const order = await processManualOrder(
      user,
      orderCart,
      type,
      note,
      parentOrder
    );

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { orderHistory: { orderId: order._id } },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Manual order created successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error creating manual order:", error);
    res.status(500).json({
      error: error.message || "An error occurred while processing the order",
    });
  }
};

/**
 * Process and create a manual order
 */
async function processManualOrder(user, orderCart, type, note, parentOrderId) {
  // Calculate product prices and validate products
  const { products, productsPrice } = await processOrderItems(orderCart);

  // Get shipping price
  const city = await City.findById(user.address.city);
  if (!city) {
    throw new Error("User city not found");
  }

  const shippingPrice = getShippingCost(city.name);
  const totalPrice = productsPrice + shippingPrice;

  // Reserve stock for all products
  await reserveOrderStock(orderCart);

  // Create the manual order
  const manualOrder = await createManualOrderRecord(
    user,
    products,
    productsPrice,
    shippingPrice,
    totalPrice,
    type,
    note,
    parentOrderId
  );

  // Link to parent order if specified
  if (parentOrderId) {
    await linkToParentOrder(parentOrderId, manualOrder._id);
  }

  return manualOrder;
}

/**
 * Process and validate order items
 */
async function processOrderItems(orderCart) {
  let productsPrice = 0;
  const products = [];

  for (const item of orderCart) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    productsPrice += product.price * item.quantity;
    products.push({
      product: item.productId,
      quantity: item.quantity,
    });
  }

  return { products, productsPrice };
}

/**
 * Reserve stock for all products in the order
 */
async function reserveOrderStock(orderCart) {
  const reservePromises = orderCart.map(async(item) => {
    const product =await Product.findById(item.productId);  
    product.totalPaid+=item.quantity;
    product.totalOrders += 1;
    
    return product.save();
  });

  await Promise.all(reservePromises);
}

/**
 * Create a new manual order record
 */
async function createManualOrderRecord(
  user,
  products,
  productsPrice,
  shippingPrice,
  totalPrice,
  type,
  note,
  parentOrder
) {
  const manualOrder = new ManualOrder({
    userId: user._id,
    products,
    phone: user.phone,
    secondaryPhone: user.secondaryPhone || user.phone,
    productsPrice,
    shippingPrice,
    totalPrice,
    invoiceId: `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceKey: `MANUAL-KEY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceLink: "#",
    paymentStatus: "manual",
    shippingAddress: {
      city: user.address.city,
      state: user.address.state,
      descriptiveAddress: user.address.descriptiveAddress,
    },
    orderNumber: `MAN-${Date.now().toString().slice(-6)}`,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    type,
    note,
    parentOrder: parentOrder || null,
  });

  await manualOrder.save();
  return manualOrder;
}

/**
 * Link a child order to its parent order
 */
async function linkToParentOrder(parentOrderId, childOrderId) {
  const parentOrder = await Order.findById(parentOrderId);
  if (!parentOrder) {
    throw new Error(`Parent order with ID ${parentOrderId} not found`);
  }

  await Order.findByIdAndUpdate(
    parentOrderId,
    { $push: { childOrders: childOrderId } },
    { new: true }
  );
}

export { addManualOrder };
