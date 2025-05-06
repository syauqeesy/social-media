import { AttachmentInfo } from "./attachment";
import { CommentInfo } from "./comment";
import { UserInfo } from "./user";

export interface PostInfo {
  id: string;
  user: UserInfo;
  caption: string;
  attachments: AttachmentInfo[];
  comments: CommentInfo[];
  created_at: number;
  updated_at: number | null;
}
