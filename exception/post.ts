import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";

export const USER_CANNOT_BE_NULL = new HttpException(
  "user cannot be null",
  HttpStatusCode.InternalServerError
);

export const ATTACHMENT_IS_REQUIRED = new HttpException(
  "attachment is required",
  HttpStatusCode.BadRequest
);

export const POST_NOT_FOUND = new HttpException(
  "post not found",
  HttpStatusCode.NotFound
);
