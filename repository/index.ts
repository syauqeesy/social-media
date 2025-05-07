import { Queryable } from "../foundation/database";
import { Attachment, AttachmentRepository } from "./attachment";
import { Post, PostRepository } from "./post";
import { User, UserRepository } from "./user";
import { UserToken, UserTokenRepository } from "./user-token";

export interface repository {
  user: UserRepository;
  userToken: UserTokenRepository;
  post: PostRepository;
  attachment: AttachmentRepository;
}

export const initRepository = (database: Queryable): repository => {
  const r: repository = {
    user: new User(database),
    userToken: new UserToken(database),
    post: new Post(database),
    attachment: new Attachment(database),
  };

  return r;
};
