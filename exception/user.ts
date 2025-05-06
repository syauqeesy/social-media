import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";

export const USERNAME_ALREADY_USED = new HttpException(
  "username already used",
  HttpStatusCode.BadRequest
);

export const AVATAR_IS_REQUIRED = new HttpException(
  "avatar is required",
  HttpStatusCode.BadRequest
);

export const USER_NOT_FOUND = new HttpException(
  "user not found",
  HttpStatusCode.NotFound
);

export const PASSWORD_WRONG = new HttpException(
  "password wrong",
  HttpStatusCode.BadRequest
);

export const INVALID_APPLICATION_SECRET = new HttpException(
  "invalid application secret",
  HttpStatusCode.InternalServerError
);
