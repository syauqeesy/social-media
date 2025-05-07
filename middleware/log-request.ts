import { NextFunction, Request, Response } from "express";
import LogFacade from "../facade/logger/logger";

const mask = (data: Record<string, any> = {}) => {
  const keys = ["password", "token", "authorization"];

  const clone: Record<string, any> = {};
  for (const key in data) {
    if (keys.includes(key.toLowerCase())) {
      clone[key] = "*****";
    } else {
      clone[key] = data[key];
    }
  }
  return clone;
};

const logRequest = (
  request: Request,
  _: Response,
  next: NextFunction
): void => {
  LogFacade.info({
    message: request.method + " " + request.originalUrl,
    meta: {
      method: request.method,
      path: request.originalUrl,
      ip: request.ip,
      headers: mask(request.headers),
      query: mask(request.query),
      params: mask(request.params),
      body: mask(request.body),
    },
  });

  next();
};

export default logRequest;
