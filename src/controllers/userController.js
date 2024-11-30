import bcrypt from "bcrypt";
import User from "../models/user.js";

import argon2 from "argon2";

const signUpController = async (req, res) => {
  try {
    const checkExist = await User.findOne({ phone: req.body.phone });
    if (checkExist) {
      res.status(400).json({ error: " رقم الهاتف مسجل بالفعل علي الموقع" });
    }

    const hash = await argon2.hash(req.body.password);

    const user = new User({
      name: req.body.name,
      phone: req.body.phone,
      password: hash,
    });
    await user.save();
    res.status(200).json({
      message: "user created",
    });
  } catch (err) {
    res.status(400).json({
      error:
        "An error occurred during sign-up, please try again." || err.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      return res.status(401).json({ message: "error in phone or password" });
    }

    const isMatch = await argon2.verify(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "error in phone or password",
      });
    }

    const token = jwt.sign(
      {
        phoneNumber: user.phoneNumber,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "user logged in",
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      message:
        "An error occurred during login, please try again." || err.message,
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred" });
  }
};

export { signUpController, loginController, getProfileController };
