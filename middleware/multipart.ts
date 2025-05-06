import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v7 as uuid } from "uuid";
import {
  INVALID_MIME_TYPE,
  UNACCEPTABLE_PAYLOAD,
} from "../exception/multipart";

const storage = multer.diskStorage({
  destination: function (
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) {
    let destination = "";

    switch (request.path) {
      case "/api/v1/user":
        destination = "./storage/avatar";
        break;
      default:
        return callback(UNACCEPTABLE_PAYLOAD, destination);
    }

    callback(null, destination);
  },
  filename: function (
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) {
    let ext = "";

    switch (file.mimetype) {
      case "image/png":
        ext = ".png";
        break;
      case "image/jpeg":
        ext = ".jpeg";
        break;
    }

    callback(null, uuid() + ext);
  },
});

const multipart = multer({
  storage,
  fileFilter: function (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) {
    const mimeTypes = ["image/png", "image/jpeg"];

    if (!mimeTypes.includes(file.mimetype)) return callback(INVALID_MIME_TYPE);

    callback(null, true);
  },
});

export default multipart;
