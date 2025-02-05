import User from "../models/User.js";

import argon2 from "argon2";

import jwt from "jsonwebtoken";
const signUpController = async (req, res) => {
  try {
    console.log(req.body);
    const checkExist = await User.findOne({ phone: req.body.phone });
    if (checkExist) {
      return res.status(409).json({ error: "Phone number already existed " });
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
        err.message || "An error occurred during sign-up, please try again.",
    });
  }
};

const loginController = async (req, res) => {
  try {
    console.log(req.body);

    const { phone, pass: password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const foundUser = await User.findOne({ phone: phone });
    if (!foundUser) {
      return res.status(401).json({ message: "error in phone or password" });
    }

    const isMatch = await argon2.verify(foundUser.password, password);

    if (!isMatch) {
      return res.status(401).json({
        message: "error in phone or password",
      });
    }
    const accessToken = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
      { id: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "15s" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 15 * 1000,
    });

    res.json({
      accessToken,
      user: {
        name: foundUser.name,
        phone: foundUser.phone,
        birthdate: foundUser.birthdate,
        address: foundUser.address,
        secondaryPhone: foundUser.secondaryPhone,
      },
    });
  } catch (err) {
    res.status(400).json({
      message:
        err.message || "An error occurred during login, please try again.",
    });
  }
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ _id: decoded.id }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          id: foundUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      res.status(200).json({
        accessToken,
        user: {
          name: foundUser.name,
          phone: foundUser.phone,
          birthdate: foundUser.birthdate,
          address: foundUser.address,
          secondaryPhone: foundUser.secondaryPhone,
        },
      });
    }
  );
};

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

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
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

export {
  signUpController,
  loginController,
  logout,
  getProfileController,
  refresh,
};
