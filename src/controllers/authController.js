import User from "../models/User.js";

import argon2 from "argon2";

import jwt from "jsonwebtoken";

const CookiesOptions = {
  httpOnly: true, //accessible only by web server
  secure: true, //https
  sameSite: "None", //cross-site cookie
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const signUpController = async (req, res) => {
  try {
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
    req.body;

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
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res.cookie("jwt", refreshToken, CookiesOptions);

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

      const accessToken = generateAccessToken(foundUser);

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

const logout = (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(400).json({ message: "No content" });

    // Clear the refresh token cookie
    res.clearCookie("jwt", CookiesOptions);

    ("Logout successful");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signUpController, loginController, logout, refresh };
