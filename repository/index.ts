import { Queryable } from "../foundation/database";

export interface repository {}

export const initRepository = (database: Queryable): repository => {
  const r: repository = {};

  return r;
};
