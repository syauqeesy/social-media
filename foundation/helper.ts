import { Response } from "express";
import { ValidationError } from "yup";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import HttpException from "../exception/exception";

export const writeResponse = <Data>(
  response: Response,
  status: number,
  message: string,
  data: Data | null
) => {
  response.status(status).json({
    message,
    data,
  });
};

export const httpErrorHandler = (response: Response, error: unknown) => {
  if (error instanceof ValidationError) {
    console.warn(error.errors);

    return writeResponse(
      response,
      HttpStatusCode.BadRequest,
      HttpStatusMessage[HttpStatusCode.BadRequest],
      error.errors
    );
  }

  if (
    error instanceof HttpException &&
    error.getStatusCode() !== HttpStatusCode.InternalServerError
  ) {
    console.warn(error);

    return writeResponse(
      response,
      error.getStatusCode(),
      error.getMessage(),
      null
    );
  }

  if (
    error instanceof HttpException &&
    error.getStatusCode() === HttpStatusCode.InternalServerError
  ) {
    console.error(error);

    return writeResponse(
      response,
      HttpStatusCode.InternalServerError,
      HttpStatusMessage[HttpStatusCode.InternalServerError],
      null
    );
  }

  if (error instanceof Error) console.error(error);

  writeResponse(
    response,
    HttpStatusCode.InternalServerError,
    HttpStatusMessage[HttpStatusCode.InternalServerError],
    null
  );
};
