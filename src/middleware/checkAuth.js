import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing!" });
    }

    let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decodedToken);
    if (!decodedToken) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing!" });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired authentication token!" });
  }
};
export default checkAuth;
