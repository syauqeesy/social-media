import { repository } from "../repository";
import { Configuration } from "../foundation/configuration";
import { Transactionable } from "../foundation/database";

class Service {
  protected configuration: Configuration;
  protected repository: repository;
  protected database: Transactionable;

  public constructor(
    configuration: Configuration,
    repository: repository,
    database: Transactionable
  ) {
    this.configuration = configuration;
    this.repository = repository;
    this.database = database;
  }
}

export default Service;
