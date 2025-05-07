import { Response } from "express";
import { service } from "../service";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import { writeResponse, httpErrorHandler } from "../foundation/helper";
import { RequestWithUserId } from "../type/common";
import { UNAUTHORIZED } from "../exception/common";

import CreateComment from "../request/create-comment";
import DeleteComment from "../request/delete-comment";

export default {
  create: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      const body = new CreateComment().capture({ ...request.body }).validate();

      const result = await service.comment.create(request.userId, body);

      writeResponse(
        response,
        HttpStatusCode.OK,
        HttpStatusMessage[HttpStatusCode.OK],
        result
      );
    } catch (error: unknown) {
      httpErrorHandler(response, error);
    }
  },
  delete: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      const body = new DeleteComment()
        .capture({ ...request.params })
        .validate();

      await service.comment.delete(request.userId, body);

      writeResponse(
        response,
        HttpStatusCode.OK,
        HttpStatusMessage[HttpStatusCode.OK],
        null
      );
    } catch (error: unknown) {
      httpErrorHandler(response, error);
    }
  },
};
