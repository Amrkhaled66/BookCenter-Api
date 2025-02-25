// models
import User from "../models/User.js";
import Order from "../models/Order.js";
import City from "../models/City.js";

import formatUserResponse from "../utils/formatUserResponse.js";

const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { cityId, state, descriptiveAddress, secondaryPhone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      secondaryPhone &&
      !/^01[0125][0-9]{8}$/.test(secondaryPhone) &&
      secondaryPhone == user.phone
    ) {
      return res
        .status(400)
        .json({ message: "Invalid secondary phone number" });
    }

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    if (!city.states.includes(state)) {
      return res
        .status(400)
        .json({ message: "Invalid state for the selected city" });
    }

    user.address = {
      city: cityId,
      state,
      descriptiveAddress,
    };
    if (secondaryPhone) {
      user.secondaryPhone = secondaryPhone;
    }

    await user.save();

    const savedUser = await formatUserResponse(user);
    res.status(200).json({
      message: "Address updated successfully",
      user: savedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const userOrders = [];
    for (let order of user.orderHistory) {
      const foundedOrder = await Order.findById(
        order.orderId.toString()
      ).populate("products", "name");
      foundedOrder, order.orderId.toString();
      userOrders.push(foundedOrder);
    }

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

export { getProfileController, updateUserController, getOrdersController };
