import multer, { diskStorage } from "multer";

function fileUpload() {
  return multer({
    storage: diskStorage({
      destination: "GuessWhoUploads",
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    }),
  });
}

export function uploadSingleFile(fieldName) {
  return fileUpload().single(fieldName);
}

export function uploadArrayFiles(fieldName) {
  return fileUpload().array(fieldName);
}

export function uploadfields(fields) {
  return fileUpload().fields(fields);
}
