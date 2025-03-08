import { ADMIN_COOKIE, USER_COOKIE } from "./defaultSettings.js";
import jwt from "jsonwebtoken"
const CookiesOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
    },
    role === "user"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_ADMIN,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
    },
    role === "user"
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_ADMIN,
    { expiresIn: "7d" }
  );
};

const generateTokensAndSetCookie = (user, res, role = "user") => {
  const accessToken = generateAccessToken(user, role);
  const refreshToken = generateRefreshToken(user, role);
  res.cookie(
    role === "user" ? USER_COOKIE : ADMIN_COOKIE,
    refreshToken,
    CookiesOptions
  );
  return accessToken;
};

export { generateTokensAndSetCookie, CookiesOptions };
