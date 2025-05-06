import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";

export const INVALID_MIME_TYPE = new HttpException(
  "invalid mimetype",
  HttpStatusCode.BadRequest
);

export const UNACCEPTABLE_PAYLOAD = new HttpException(
  HttpStatusMessage[HttpStatusCode.NotAcceptable],
  HttpStatusCode.NotAcceptable
);
