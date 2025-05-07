import { Queryable } from "../foundation/database";
import { Attachment, AttachmentRepository } from "./attachment";
import { Comment, CommentRepository } from "./comment";
import { Post, PostRepository } from "./post";
import { User, UserRepository } from "./user";
import { UserToken, UserTokenRepository } from "./user-token";

export interface repository {
  user: UserRepository;
  userToken: UserTokenRepository;
  post: PostRepository;
  attachment: AttachmentRepository;
  comment: CommentRepository;
}

export const initRepository = (database: Queryable): repository => {
  const r: repository = {
    user: new User(database),
    userToken: new UserToken(database),
    post: new Post(database),
    attachment: new Attachment(database),
    comment: new Comment(database),
  };

  return r;
};
