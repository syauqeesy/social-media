import { NextFunction, RequestHandler, Response } from "express";
import { RequestWithUserId } from "../type/common";
import { MulterError } from "multer";
import { httpErrorHandler } from "../foundation/helper";
import { FILE_TOO_LARGE, INVALID_FILE_UPLOAD } from "../exception/common";
import LogFacade from "../facade/logger/logger";

const upload = (upload: RequestHandler) => {
  return (
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ) => {
    upload(request, response, (error: unknown) => {
      if (
        error instanceof MulterError &&
        error.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        LogFacade.error(error);

        return httpErrorHandler(response, INVALID_FILE_UPLOAD);
      }

      if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
        LogFacade.error(error);

        return httpErrorHandler(response, FILE_TOO_LARGE);
      }

      if (error instanceof MulterError) {
        return httpErrorHandler(response, error);
      }

      if (error instanceof Error) {
        return httpErrorHandler(response, error);
      }

      next();
    });
  };
};

export default upload;
