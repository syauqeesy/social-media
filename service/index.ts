import { Transactionable } from "../repository/database";
import { Configuration } from "../foundation/configuration";
import { repository } from "../repository";
import { User, UserService } from "./user";
import { Post, PostService } from "./post";

export interface service {
  user: UserService;
  post: PostService;
}

export const initService = (
  configuration: Configuration,
  repository: repository,
  database: Transactionable
) => {
  const s: service = {
    user: new User(configuration, repository, database),
    post: new Post(configuration, repository, database),
  };

  return s;
};
