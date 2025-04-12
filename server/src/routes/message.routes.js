import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSideBar,
  sendMessage,
} from "../controller/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getUsersForSideBar);

messageRouter.get("/:id", authMiddleware, getMessages);

messageRouter.post("/send", authMiddleware, sendMessage);

export default messageRouter;
