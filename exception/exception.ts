import { HttpStatusCode } from "../enum/http-status-code";

class HttpException extends Error {
  public message!: string;
  private statusCode!: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super();

    this.setMessage(message);
    this.setStatusCode(statusCode);
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public setStatusCode(statusCode: HttpStatusCode): void {
    this.statusCode = statusCode;
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): HttpStatusCode {
    return this.statusCode;
  }
}

export default HttpException;
