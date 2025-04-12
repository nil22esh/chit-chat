import express from "express";
import {
  checkAuthenticated,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controller/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.put("/update", authMiddleware, updateProfile);

userRouter.get("/checkAuth", authMiddleware, checkAuthenticated);

export default userRouter;
