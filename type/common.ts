import { Request } from "express";

export interface RequestWithUserId extends Request {
  userId?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}
