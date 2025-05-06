import { NextFunction, RequestHandler, Response } from "express";
import { RequestWithUserId } from "../type/common";
import { MulterError } from "multer";
import { httpErrorHandler } from "../foundation/helper";

const upload = (upload: RequestHandler) => {
  return (
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ) => {
    upload(request, response, (error: unknown) => {
      if (error instanceof MulterError || error instanceof Error)
        return httpErrorHandler(response, error);

      next();
    });
  };
};

export default upload;
