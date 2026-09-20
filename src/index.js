import "./app/common/db/connection.js";
import express from "express";
import {authRouter} from "./app/auth/auth.router.js";
import { globalErrorHandler } from "./app/common/error/error.js";
const app = express();
app.use(express.json());

app.use("/guess-who/auth", authRouter);

app.use(globalErrorHandler);

app.listen(3000, ()=>{
    console.log("server running on port 3000\n\nhttp://localhost:3000");
});