import { Router } from "express";
import * as upload from "../../lib/media/multer.js";
import * as userController from "./controller/user.controller.js";

export const userRouter = new Router();

userRouter.post(
  "/upload-profile-picture",
  upload.uploadSingleFile("profilePicture", ["image/png", "image/jpg"]),
  (req, res, next) => {
    res.json({ message: "OK" });
  },
);
