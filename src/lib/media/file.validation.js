import { fileTypeFromBuffer } from "file-type";
import fs from "fs/promises";
import { AppError } from "../error/app.error.js";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (allowedTypes = ["image/png", "image/jpeg"]) => {
  return async (req, res, next) => {
    try {
      if (req.file.size > 5 * 1024 * 1024) {
        throw new AppError("Invalid action: File size is too big", 400);
      }

      const filePath = req.file.path;

      const buffer = await fs.readFile(filePath);

      const type = await fileTypeFromBuffer(buffer);

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!type || !allowedTypes.includes(type.mime)) {
        await fs.unlink(filePath);
        return next(new AppError("Invalid action: Invalid file type", 400));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
