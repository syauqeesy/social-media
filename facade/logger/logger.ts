import winston, { transports } from "winston";

class LogFacade {
  private static logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new transports.File({ filename: "storage/application.log" }),
    ],
  });

  static info(data: unknown) {
    if (typeof data !== "object") throw new Error("invalid log data");

    this.logger.info(data);
  }

  static warn(data: unknown) {
    if (typeof data !== "object") throw new Error("invalid log data");

    this.logger.warn(data);
  }

  static error(data: unknown) {
    if (typeof data !== "object") throw new Error("invalid log data");

    this.logger.error(data);
  }

  static debug(data: unknown) {
    if (typeof data !== "object") throw new Error("invalid log data");

    this.logger.debug(data);
  }
}

export default LogFacade;
