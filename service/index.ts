import { Transactionable } from "../repository/database";
import { Configuration } from "../foundation/configuration";
import { repository } from "../repository";
import { UserService, User } from "./user";

export interface service {
  user: UserService;
}

export const initService = (
  configuration: Configuration,
  repository: repository,
  database: Transactionable
) => {
  const s: service = {
    user: new User(configuration, repository, database),
  };

  return s;
};
