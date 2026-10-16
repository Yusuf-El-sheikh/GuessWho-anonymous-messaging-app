import { Router } from "express";
import * as upload from "../../lib/media/multer.js";
import * as userController from "./controller/user.controller.js";
import { guard } from "../../lib/auth/guard.js";
import { fileValidation } from "../../lib/media/file.validation.js";

export const userRouter = new Router();

userRouter.post(
  "/upload-profile-picture",
  guard,
  upload.uploadSingleFile("profile-picture", ["image/png", "image/jpeg"]),
  fileValidation(["image/png", "image/jpeg"]),
  userController.updateProfilePicture,
);
