import { v7 as uuid } from "uuid";
import { string } from "yup";
import User from "./user";
import { PostInfo } from "../type/post";
import { USER_CANNOT_BE_NULL } from "../exception/post";

export interface PostModel {
  id?: string;
  user_id: string;
  user?: User;
  caption: string;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class Post {
  private id!: string;
  private user_id!: string;
  private user?: User;
  private caption!: string;
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(userToken: PostModel) {
    this.setId(userToken.id);
    this.setUserId(userToken.user_id);
    this.setCaption(userToken.caption);
    this.setCreatedAt(userToken.created_at);
    if (userToken.updated_at) this.setUpdatedAt(userToken.updated_at);
    if (userToken.deleted_at) this.setDeletedAt(userToken.deleted_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setUserId(refreshToken: string): void {
    const rules = string().required();

    rules.validateSync(refreshToken);

    this.user_id = refreshToken;
  }

  public setUser(user?: User): void {
    this.user = user;
  }

  public setCaption(accessToken: string): void {
    const rules = string().required();

    rules.validateSync(accessToken);

    this.caption = accessToken;
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

  public getCreatedAt(): number {
    return this.created_at;
  }

  public getUpdatedAt(): number | null {
    return this.updated_at;
  }

  public getDeletedAt(): number | null {
    return this.deleted_at;
  }

  public getInfo(): PostInfo {
    const user = this.getUser();

    if (!user) throw USER_CANNOT_BE_NULL;

    const info: PostInfo = {
      id: this.getId(),
      user: user.getInfo(),
      caption: this.getCaption(),
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
    };

    return info;
  }
}

export default Post;
