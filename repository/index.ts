import { Queryable } from "../foundation/database";
import { UserRepository, User } from "./user";
import { UserToken, UserTokenRepository } from "./user-token";

export interface repository {
  user: UserRepository;
  userToken: UserTokenRepository;
}

export const initRepository = (database: Queryable): repository => {
  const r: repository = {
    user: new User(database),
    userToken: new UserToken(database),
  };

  return r;
};
