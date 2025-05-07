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
import Pagination from "../request/pagination";
import ShowUser from "../request/show-user";

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

      const [result, pagination] = await service.user.list(body);

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
    request: Request,
    response: Response,
    service: service
  ): Promise<void> => {
    try {
      const body = new ShowUser().capture({ ...request.params }).validate();

      const result = await service.user.show(body);

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
