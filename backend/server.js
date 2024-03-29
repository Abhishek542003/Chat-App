import express from "express";
import colors from "colors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectDB from "./db/connectToMongoDb.js";

const app = express();
const PORT = process.env.PORT || 5000;


dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server Running On ${PORT}`.bgBlue.white);
});
