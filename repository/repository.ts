import { Queryable } from "../foundation/database";

class Repository {
  protected database: Queryable;

  public constructor(database: Queryable) {
    this.database = database;
  }
}

export default Repository;
