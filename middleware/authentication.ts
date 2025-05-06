import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import configuration from "../foundation/configuration";
import { httpErrorHandler, writeResponse } from "../foundation/helper";
import { RequestWithUserId } from "../type/common";
import { UNAUTHORIZED } from "../exception/common";

const authentication = (
  request: RequestWithUserId,
  response: Response,
  next: NextFunction
): void => {
  try {
    const authenticationHeader = request.headers.authorization;

    if (!authenticationHeader) throw UNAUTHORIZED;

    const headerValues = authenticationHeader.split(" ");

    if (headerValues.length !== 2) throw UNAUTHORIZED;

    const payload = jsonwebtoken.verify(
      headerValues[1],
      configuration.application.secret
    ) as { user_id: string; iat: number; exp: number };

    if (!payload.user_id) throw UNAUTHORIZED;

    request.userId = payload.user_id;

    return next();
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);

    httpErrorHandler(response, UNAUTHORIZED);
  }
};

export default authentication;
