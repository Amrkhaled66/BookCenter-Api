import Product from "../../models/Product.js";
const getOrderCart = (cart) => {
  return cart.map(async ({ productInfo: { id }, quantity }) => {
    const product = await Product.findById(id);
    return {
      name: product.name,
      price: product.price,
      quantity,
    };
  });
};

const getOrderTotal = (cart) => {
  return cart.reduce((total, item) => {
    const product = Product.findById(item.productInfo.id);
    return total + product.price * item.quantity;
  }, 0);
};

const getShippingPrice = (city) => {
  city = city.toLowerCase();
  if (city === "cairo" || city === "giza") {
    return 55;
  }
  return 60;
};
export { getOrderCart, getOrderTotal, getShippingPrice };
