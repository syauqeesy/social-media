import { v7 as uuid } from "uuid";
import { string } from "yup";
import User from "./user";
import { CommentInfo } from "../type/comment";
import { USER_CANNOT_BE_NULL } from "../exception/post";

export interface CommentModel {
  id?: string;
  post_id: string;
  user_id: string;
  user?: User;
  content: string;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class Comment {
  private id!: string;
  private post_id!: string;
  private user_id!: string;
  private user?: User;
  private content!: string;
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(comment: CommentModel) {
    this.setId(comment.id);
    this.setPostId(comment.post_id);
    this.setUserId(comment.user_id);
    this.setContent(comment.content);
    this.setCreatedAt(comment.created_at);
    if (comment.updated_at) this.setUpdatedAt(comment.updated_at);
    if (comment.deleted_at) this.setDeletedAt(comment.deleted_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setPostId(postId: string): void {
    const rules = string().required();

    rules.validateSync(postId);

    this.post_id = postId;
  }

  public setUserId(userId: string): void {
    const rules = string().required();

    rules.validateSync(userId);

    this.user_id = userId;
  }

  public setUser(user?: User): void {
    this.user = user;
  }

  public setContent(accessToken: string): void {
    const rules = string().required();

    rules.validateSync(accessToken);

    this.content = accessToken;
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

  public getPostId(): string {
    return this.post_id;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getContent(): string {
    return this.content;
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

  public getInfo(baseUrl: string): CommentInfo {
    const user = this.getUser();

    if (!user) throw USER_CANNOT_BE_NULL;

    const info: CommentInfo = {
      id: this.getId(),
      user: user.getInfo(baseUrl),
      content: this.getContent(),
      created_at: this.getCreatedAt(),
    };

    return info;
  }
}

export default Comment;
