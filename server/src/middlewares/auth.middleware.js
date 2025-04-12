import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwtToken || req.headers.authorization.split(" ")[1];
  // check if token is present
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, Please login!",
    });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, Please login!",
      });
    }
    // check if user exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, Please login!",
      });
    }
    // attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error while verifying token: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Unauthorized, Please login!",
    });
  }
};

export default authMiddleware;
