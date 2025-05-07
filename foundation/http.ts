import express, { Application, json, Request, Response } from "express";
import { Server } from "http";
import configuration, { Configuration } from "./configuration";
import path from "path";
import { Bootable } from "./foundation";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import { writeResponse } from "./helper";
import Database, { Queryable, Transactionable } from "./database";
import { initHandler } from "../handler";
import { initService } from "../service";
import { initRepository } from "../repository";

class Http implements Bootable {
  private configuration: Configuration;
  private application: Application;
  private database: Bootable & Queryable & Transactionable;

  private server!: Server;

  constructor() {
    this.configuration = configuration;
    this.application = express();
    this.database = new Database({
      host: this.configuration.database.host,
      port: this.configuration.database.port,
      user: this.configuration.database.user,
      password: this.configuration.database.password,
      database: this.configuration.database.name,
    });
  }

  public async boot(): Promise<void> {
    this.database.boot();

    const [result] = await this.database.withConnection(
      async (conn) => await conn.execute("SELECT NOW() AS THIS_MOMENT")
    );

    console.log(result);

    this.application.use(json());

    this.application.use(
      "/storage",
      express.static(path.join(__dirname, "../", "../", "storage"))
    );

    this.application.disable("x-powered-by");
    this.application.disable("etag");

    const repository = initRepository(this.database);

    initHandler(
      this.application,
      initService(this.configuration, repository, this.database),
      repository.userToken
    );

    this.application.use((_: Request, response: Response) =>
      writeResponse(
        response,
        HttpStatusCode.NotFound,
        HttpStatusMessage[HttpStatusCode.NotFound],
        null
      )
    );

    if (!this.server) {
      this.server = this.application.listen(
        this.configuration.application.port,
        () =>
          console.log(
            `server running on port ${this.configuration.application.port}`
          )
      );
    }

    process.on("SIGINT", () => this.shutdown());
    process.on("SIGTERM", () => this.shutdown());
  }

  public async shutdown(): Promise<void> {
    if (!this.server || !this.database) return;

    await this.database.shutdown();

    console.log("database stopped");

    this.server.close((error) => {
      if (!error) console.log("server stopped");
    });
  }
}

export default Http;
