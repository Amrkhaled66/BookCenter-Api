import jwt from "jsonwebtoken";

const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing!" });
  }
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_ADMIN);
    req.admin = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default checkAdmin;
