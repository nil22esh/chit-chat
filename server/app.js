import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./src/db/db.js";
import userRouter from "./src/routes/user.routes.js";
import messageRouter from "./src/routes/message.routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.get("/dummy", (req, res) => {
  res.send("Hello from the dummy endpoint!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

app.listen(port, () => {
  console.log(`${process.env.ENVIRONMENT} server is running on port ${port}`);
  dbConnection();
});
