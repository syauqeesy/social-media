import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";

export const USER_CANNOT_BE_NULL = new HttpException(
  "user cannot be null",
  HttpStatusCode.InternalServerError
);
