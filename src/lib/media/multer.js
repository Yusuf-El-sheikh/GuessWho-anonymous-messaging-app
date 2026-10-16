import multer, { diskStorage } from "multer";
import crypto from "node:crypto";
import { AppError } from "../error/app.error.js";

function fileUpload(allowedTypes = ["image/png", "image/jpeg"]) {
  return multer({
    fileFilter: (req, file, callback) => {
      if (!allowedTypes.includes(file.mimetype)) {
        callback(
          new AppError("Invalid action: invalid file format", 400),
          false,
        );
        return;
      }

      callback(null, true); 
    },
    storage: diskStorage({
      destination: "GuessWhoUploads",
      filename: (req, file, callback) => {
        callback(null, `${crypto.randomUUID()}-${file.originalname}`);
      },
    }),
  });
}

export function uploadSingleFile(
  fieldName,
  allowedTypes = ["image/png", "image/jpeg"],
) {
  return fileUpload(allowedTypes).single(fieldName);
}

//primitive methods very unlikely to be further developed for lack of purpose, yet declared just in case
export function uploadArrayFiles(fieldName, maxCount) {
  return fileUpload().array(fieldName, maxCount);
}

//primitive methods very unlikely to be further developed for lack of purpose, yet declared just in case
export function uploadfields(fields) {
  return fileUpload().fields(fields);
}
