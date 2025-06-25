import Product from "../../models/Product.js";
// Function to get order cart with valid async handling
const getOrderCart = async (cart) => {
  try {
    const cartItems = await Promise.all(
      cart.map(async ({ productInfo: { id }, quantity }) => {
        const product = await Product.findById(id);
        if (!product) throw new Error(`Product with ID ${id} not found`);
                      return {
          name: product.name,
          price: product.discountPrice||product.price,
          quantity,
        };
      })
    );
    return cartItems;
  } catch (error) {
    console.error("Error fetching order cart:", error);
    throw error;
  }
};


const getOrderTotal = async (cart) => {
  try {
    let total = 0;
    for (const item of cart) {
      const product = await Product.findById(item.productInfo.id);
      if (!product) throw new Error(`Product with ID ${item.productInfo.id} not found`);
      const productMainPrice = product.discountPrice || product.price;
      total += productMainPrice * item.quantity;
    }
    return total;
  } catch (error) {
    console.error("Error calculating order total:", error);
    throw error;
  }
};



export { getOrderCart, getOrderTotal };
