import { Application, Request, Response } from "express";
import authentication from "../middleware/authentication";
import upload from "../middleware/upload";
import multipart from "../middleware/multipart";
import { service } from "../service";

import user from "./user";
import { RequestWithUserId } from "../type/common";
import post from "./post";
import comment from "./comment";
import { UserTokenRepository } from "../repository/user-token";
import initAuthenticationMiddleware from "../middleware/authentication";

export type handlerFunction = (
  request: Request,
  response: Response,
  service: service
) => Promise<void>;

export const initHandler = (
  application: Application,
  service: service,
  userTokenRepository: UserTokenRepository
) => {
  const authentication = initAuthenticationMiddleware(userTokenRepository);

  // User
  application.post(
    "/api/v1/user",
    [upload(multipart.single("avatar"))],
    (request: Request, response: Response) =>
      user.register(request, response, service)
  );
  application.post(
    "/api/v1/user/login",
    (request: Request, response: Response) =>
      user.login(request, response, service)
  );
  application.get(
    "/api/v1/user",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      user.show(request, response, service)
  );
  application.patch(
    "/api/v1/user",
    [authentication, upload(multipart.single("avatar"))],
    (request: RequestWithUserId, response: Response) =>
      user.edit(request, response, service)
  );
  application.post(
    "/api/v1/user/logout",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      user.logout(request, response, service)
  );

  // Post
  application.get(
    "/api/v1/post/:id",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      post.show(request, response, service)
  );
  application.post(
    "/api/v1/post",
    [authentication, upload(multipart.array("attachments", 5))],
    (request: RequestWithUserId, response: Response) =>
      post.create(request, response, service)
  );
  application.patch(
    "/api/v1/post/:id",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      post.edit(request, response, service)
  );
  application.delete(
    "/api/v1/post/:id",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      post.delete(request, response, service)
  );

  // Comment
  application.post(
    "/api/v1/comment",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      comment.create(request, response, service)
  );
  application.delete(
    "/api/v1/comment/:id",
    [authentication],
    (request: RequestWithUserId, response: Response) =>
      comment.delete(request, response, service)
  );
};
