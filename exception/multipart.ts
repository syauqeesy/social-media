import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";

export const INVALID_MIME_TYPE = new HttpException(
  "invalid mimetype",
  HttpStatusCode.BadRequest
);
