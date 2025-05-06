import { AttachmentInfo } from "./attachment";
import { UserInfo } from "./user";

export interface PostInfo {
  id: string;
  user: UserInfo;
  caption: string;
  attachments: AttachmentInfo[];
  created_at: number;
  updated_at: number | null;
}
