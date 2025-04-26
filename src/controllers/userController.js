// models
import User from "../models/User.js";
import City from "../models/City.js";

import formatUserResponse from "../utils/formatUserResponse.js";
import formatOrders from "../utils/formatOrders.js";
import argon2 from "argon2";

const getProfileController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const user = await User.findById(id).select("-password -_id");
    const orders = await formatOrders(user.orderHistory);
    const formattedUser = await formatUserResponse(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: formattedUser,
      orderHistory: orders,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.message || "An error occurred" });
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
      return res.status(404).json({ message: "User not found" });
    }
    const userOrders = await formatOrders(user.orderHistory);

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

const getUserId = async (req, res) => {
  try {
    const { phone } = req.query;

    const foundedUser = await User.findOne({ phone });

    if (!foundedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ id: foundedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message || "server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password)
      return res.status(400).json({ message: "Missing fields" });

    const hashedPassword = await argon2.hash(req.body.password);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User Not Found" });

    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    console.log(phone);
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message || "server error" });
  }
};

export {
  getProfileController,
  updateUserController,
  getOrdersController,
  getUserId,
  updatePassword,
  getUserByPhone,
};
