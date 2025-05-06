import { UserInfo } from "./user";

export interface PostInfo {
  id: string;
  user: UserInfo;
  caption: string;
  created_at: number;
  updated_at: number | null;
}
