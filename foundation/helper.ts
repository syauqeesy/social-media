import { Response } from "express";

export const writeResponse = <Data>(
  response: Response,
  status: number,
  message: string,
  data: Data | null
) => {
  response.status(status).json({
    message,
    data,
  });
};
