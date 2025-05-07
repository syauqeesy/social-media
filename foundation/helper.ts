import { Response } from "express";
import { ValidationError } from "yup";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import HttpException from "../exception/exception";
import { PaginationInfo } from "../type/common";
import LogFacade from "../facade/logger/logger";

export const writeResponse = <Data>(
  response: Response,
  status: number,
  message: string,
  data: Data | null,
  pagination?: PaginationInfo
) => {
  const payload: {
    message: string;
    data: Data | null;
    pagination?: PaginationInfo;
  } = {
    message,
    data,
  };

  if (pagination) payload.pagination = pagination;

  response.status(status).json(payload);
};

export const httpErrorHandler = (response: Response, error: unknown) => {
  if (error instanceof ValidationError) {
    LogFacade.warn(error.errors);

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
    LogFacade.warn(error);

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
    LogFacade.error(error);

    return writeResponse(
      response,
      HttpStatusCode.InternalServerError,
      HttpStatusMessage[HttpStatusCode.InternalServerError],
      null
    );
  }

  if (error instanceof Error) LogFacade.error(error);

  writeResponse(
    response,
    HttpStatusCode.InternalServerError,
    HttpStatusMessage[HttpStatusCode.InternalServerError],
    null
  );
};

export const dateHandler = (
  date: string,
  endOfDay: boolean = false
): number => {
  if (date === "0000-00-00") return 0;

  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  if (endOfDay) result.setHours(23, 59, 59, 999);

  return result.getTime();
};

export const paginationHelper = (
  total: number,
  page: number,
  limit: 5 | 10
): PaginationInfo => {
  return {
    page: page,
    limit: limit,
    total: total,
  };
};
