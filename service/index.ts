import { Transactionable } from "../repository/database";
import { Configuration } from "../foundation/configuration";
import { repository } from "../repository";
import { User, UserService } from "./user";
import { Post, PostService } from "./post";
import { Comment, CommentService } from "./comment";

export interface service {
  user: UserService;
  post: PostService;
  comment: CommentService;
}

export const initService = (
  configuration: Configuration,
  repository: repository,
  database: Transactionable
) => {
  const s: service = {
    user: new User(configuration, repository, database),
    post: new Post(configuration, repository, database),
    comment: new Comment(configuration, repository, database),
  };

  return s;
};
