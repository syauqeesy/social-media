import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";

export const UNAUTHORIZED = new HttpException(
  HttpStatusMessage[HttpStatusCode.Unauthorized],
  HttpStatusCode.Unauthorized
);
