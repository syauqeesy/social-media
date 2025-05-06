import express, { Application, json, Request, Response } from "express";
import { Server } from "http";
import configuration, { Configuration } from "./configuration";
import path from "path";
import { Bootable } from "./foundation";
import { HttpStatusCode } from "../enum/http-status-code";
import { HttpStatusMessage } from "../enum/http-status-message";
import { writeResponse } from "./helper";

class Http implements Bootable {
  private configuration: Configuration;
  private application: Application;

  private server!: Server;

  constructor() {
    this.configuration = configuration;
    this.application = express();
  }

  public async boot(): Promise<void> {
    this.application.use(json());

    this.application.use(
      "/storage",
      express.static(path.join(__dirname, "../", "../", "storage"))
    );

    this.application.disable("x-powered-by");
    this.application.disable("etag");

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
    this.server.close((error) => {
      if (!error) console.log("server stopped");
    });
  }
}

export default Http;
