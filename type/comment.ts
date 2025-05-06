import { UserInfo } from "./user";

export interface CommentInfo {
  id: string;
  user: UserInfo;
  content: string;
  created_at: number;
}
