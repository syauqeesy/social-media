import { v7 as uuid } from "uuid";
import { string } from "yup";
import User from "./user";
import { PostInfo } from "../type/post";
import { USER_CANNOT_BE_NULL } from "../exception/post";
import Attachment from "./attachment";
import { AttachmentInfo } from "../type/attachment";
import { CommentInfo } from "../type/comment";
import Comment from "./comment";

export interface PostModel {
  id?: string;
  user_id: string;
  user?: User;
  caption: string;
  attachments: Attachment[];
  comments: Comment[];
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class Post {
  private id!: string;
  private user_id!: string;
  private user?: User;
  private caption!: string;
  private attachments!: Attachment[];
  private comments!: Comment[];
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(post: PostModel) {
    this.setId(post.id);
    this.setUserId(post.user_id);
    this.setCaption(post.caption);
    this.setCreatedAt(post.created_at);
    if (post.updated_at) this.setUpdatedAt(post.updated_at);
    if (post.deleted_at) this.setDeletedAt(post.deleted_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setUserId(userId: string): void {
    const rules = string().required();

    rules.validateSync(userId);

    this.user_id = userId;
  }

  public setUser(user?: User): void {
    this.user = user;
  }

  public setCaption(caption: string): void {
    const rules = string().required();

    rules.validateSync(caption);

    this.caption = caption;
  }

  public setAttachments(attachments: Attachment[]): void {
    this.attachments = attachments;
  }

  public setComments(comments: Comment[]): void {
    this.comments = comments;
  }

  public setCreatedAt(createdAt?: number): void {
    this.created_at = createdAt ? createdAt : Date.now();
  }

  public setUpdatedAt(updatedAt?: number | null): void {
    this.updated_at = typeof updatedAt !== "undefined" ? updatedAt : Date.now();
  }

  public setDeletedAt(deletedAt?: number | null): void {
    this.deleted_at = typeof deletedAt !== "undefined" ? deletedAt : Date.now();
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getCaption(): string {
    return this.caption;
  }

  public getAttachments(): Attachment[] {
    return this.attachments;
  }

  public getComments(): Comment[] {
    return this.comments;
  }

  public getCreatedAt(): number {
    return this.created_at;
  }

  public getUpdatedAt(): number | null {
    return this.updated_at;
  }

  public getDeletedAt(): number | null {
    return this.deleted_at;
  }

  public getInfo(baseUrl: string): PostInfo {
    const user = this.getUser();

    if (!user) throw USER_CANNOT_BE_NULL;

    const attachmentInfos: AttachmentInfo[] = [];

    for (const attachment of this.getAttachments()) {
      attachmentInfos.push(attachment.getInfo(baseUrl));
    }

    const commentInfos: CommentInfo[] = [];

    for (const comment of this.getComments()) {
      commentInfos.push(comment.getInfo());
    }

    const info: PostInfo = {
      id: this.getId(),
      user: user.getInfo(baseUrl),
      caption: this.getCaption(),
      attachments: attachmentInfos,
      comments: commentInfos,
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
    };

    return info;
  }
}

export default Post;
