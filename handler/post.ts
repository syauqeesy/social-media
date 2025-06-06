import { Request, Response } from "express";
import { service } from "../service";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import { writeResponse, httpErrorHandler } from "../foundation/helper";
import { RequestWithUserId } from "../type/common";
import { UNAUTHORIZED } from "../exception/common";
import { ATTACHMENT_IS_REQUIRED } from "../exception/post";

import CreatePost, { AttachmentRequest } from "../request/create-post";
import EditPost from "../request/edit-post";
import ShowPost from "../request/show-post";
import DeletePost from "../request/delete-post";
import Pagination from "../request/pagination";

export default {
  list: async (
    request: Request,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      const today = new Date();

      const from = "0000-00-00";
      const to = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const body = new Pagination()
        .capture({
          page: request.query.page ? request.query.page : 1,
          limit: request.query.limit ? Number(request.query.limit) : 5,
          sort: request.query.sort
            ? String(request.query.sort).toUpperCase()
            : "DESC",
          from: request.query.from ? request.query.from : from,
          to: request.query.to ? request.query.to : to,
          q: request.query.q ? request.query.q : "",
        })
        .validate();

      const [result, pagination] = await service.post.list(body);

      writeResponse(
        response,
        HttpStatusCode.OK,
        HttpStatusMessage[HttpStatusCode.OK],
        result,
        pagination
      );
    } catch (error: unknown) {
      httpErrorHandler(response, error);
    }
  },
  show: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      const body = new ShowPost().capture({ ...request.params }).validate();

      const result = await service.post.show(body);

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
  create: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      if (!request.files) throw ATTACHMENT_IS_REQUIRED;

      const attachments: AttachmentRequest[] = [];

      for (const file of request.files as Iterable<Express.Multer.File>) {
        attachments.push({
          name: file.filename,
          original_name: file.originalname,
        });
      }

      const body = new CreatePost()
        .capture({ ...request.body, attachments: attachments })
        .validate();

      const result = await service.post.create(request.userId, body);

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
  edit: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      const body = new EditPost()
        .capture({ ...request.body, ...request.params })
        .validate();

      const result = await service.post.edit(request.userId, body);

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

      const body = new DeletePost().capture({ ...request.params }).validate();

      await service.post.delete(request.userId, body);

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
