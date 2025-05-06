import { Request, Response } from "express";
import { service } from "../service";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import { writeResponse, httpErrorHandler } from "../foundation/helper";
import { RequestWithUserId } from "../type/common";
import { UNAUTHORIZED } from "../exception/common";
import { AVATAR_IS_REQUIRED } from "../exception/user";

import Register from "../request/register";
import Login from "../request/login";
import EditUser from "../request/edit-user";

export default {
  register: async (
    request: Request,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.file) throw AVATAR_IS_REQUIRED;

      const body = new Register()
        .capture({ ...request.body, avatar: request.file.filename })
        .validate();

      const result = await service.user.register(body);

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
  login: async (
    request: Request,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      const body = new Login().capture(request.body).validate();

      const result = await service.user.login(body);

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
  show: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      const result = await service.user.show(request.userId);

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

      const body = new EditUser()
        .capture({
          ...request.body,
          avatar: request.file ? request.file.filename : null,
        })
        .validate();

      const result = await service.user.edit(request.userId, body);

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
  logout: async (
    request: RequestWithUserId,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      if (!request.userId) throw UNAUTHORIZED;

      await service.user.logout(request.userId);

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
