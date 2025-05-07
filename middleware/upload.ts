import { NextFunction, RequestHandler, Response } from "express";
import { RequestWithUserId } from "../type/common";
import { MulterError } from "multer";
import { httpErrorHandler } from "../foundation/helper";
import { INVALID_FILE_UPLOAD } from "../exception/common";
import LogFacade from "../facade/logger/logger";

const upload = (upload: RequestHandler) => {
  return (
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ) => {
    upload(request, response, (error: unknown) => {
      if (error instanceof MulterError || error instanceof Error) {
        if (error instanceof MulterError) {
          LogFacade.error(error);

          return httpErrorHandler(response, INVALID_FILE_UPLOAD);
        }

        return httpErrorHandler(response, error);
      }

      next();
    });
  };
};

export default upload;
