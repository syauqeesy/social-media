import HttpException from "./exception";
import { HttpStatusCode } from "../enum/http-status-code";

export const COMMENT_NOT_FOUND = new HttpException(
  "comment not found",
  HttpStatusCode.NotFound
);
