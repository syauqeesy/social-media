import { Transactionable } from "../repository/database";
import { Configuration } from "../foundation/configuration";
import { repository } from "../repository";

export interface service {}

export const initService = (
  configuration: Configuration,
  repository: repository,
  database: Transactionable
) => {
  const s: service = {};

  return s;
};
