import Admin from "../models/Admin.js";
import User from "../models/User.js";

import argon2 from "argon2";

import {
  generateTokensAndSetCookie,
  CookiesOptions,
} from "../services/auth.js";
import formatUserResponse from "../utils/formatUserResponse.js";

import { ADMIN_COOKIE } from "../services/defaultSettings.js";
import jwt from "jsonwebtoken";

const loginAdmin = async (req, res) => {
  try {
    const { email, pass: password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const foundUser = await Admin.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).json({ message: "error in phone or password" });
    }

    const isMatch = await argon2.verify(foundUser.password, password);

    if (!isMatch) {
      return res.status(401).json({
        message: "error in phone or password",
      });
    }

    const accessToken = generateTokensAndSetCookie(foundUser, res, "admin");

    res.json({
      accessToken,
      admin: {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      message:
        err.message || "An error occurred during login, please try again.",
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await argon2.hash(password);

    admin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies[ADMIN_COOKIE]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies[ADMIN_COOKIE];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_ADMIN,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        try {
          const foundUser = await Admin.findById(decoded.id)
            .select("-password")
            .exec();

          if (!foundUser) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const accessToken = generateTokensAndSetCookie(
            foundUser,
            res,
            "admin"
          );

          res.status(200).json({
            accessToken,
            user: foundUser,
          });
        } catch (error) {
          console.error("Error in refresh function:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  } catch (error) {
    console.error("Error in refresh function:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.[ADMIN_COOKIE])
      return res.status(400).json({ message: "No content" });

    res.clearCookie(ADMIN_COOKIE, CookiesOptions);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginAsUser = async (req, res) => {
  try {
    const { phone } = req.body;

    const foundUser = await User.findOne({ phone: phone });
    if (!foundUser) return res.status(404).json({ message: "user not found" });

    const accessToken = generateTokensAndSetCookie(foundUser, res);
    const userResponse = await formatUserResponse(foundUser);

    res.json({
      accessToken,
      user: userResponse,
    });
  } catch (err) {
    res.status(400).json({
      message:
        err.message || "An error occurred during login, please try again.",
    });
  }
};

export { registerAdmin, loginAdmin, refresh, logout, loginAsUser };
