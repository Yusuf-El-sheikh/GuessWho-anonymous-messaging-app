import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { AppError } from "../error/app.error";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (allowedTypes = ["image/png", "image/jpg"]) => {
  return async (req, res, next) => {
    try {
      if (req.file.size > 5 * 1024 * 1024) {
        throw new AppError("Invalid action: File size is too big", 400);
      }

      const filePath = req.file.path;

      const buffer = fs.readFileSync(filePath);

      const type = await fileTypeFromBuffer(buffer);

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!type || !allowedTypes.includes(type.mime)) fs.unlink(filePath);
      return next(new Error("Invalid action: Invalid file type", 400));

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
