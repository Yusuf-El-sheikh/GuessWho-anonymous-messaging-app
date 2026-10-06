import "dotenv/config.js"
import "./lib/db/connection.js";
import express from "express";
import { authRouter } from "./app/auth/auth.router.js";
import { globalErrorHandler } from "./pkg/error/globalErrorHandler.js";
import cors from "cors"

const app = express();
app.use(express.json());

app.use(cors({origin: "http://localhost:4200"}))

app.use("/guess-who/auth", authRouter);

app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log("server running on port 3000\n\nhttp://localhost:3000");
});
