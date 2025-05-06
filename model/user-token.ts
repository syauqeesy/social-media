import { v7 as uuid } from "uuid";
import { boolean, string } from "yup";

export interface UserTokenModel {
  id?: string;
  user_id: string;
  access_token: string;
  is_revoked: boolean;
  created_at?: number;
  updated_at?: number | null;
}

class UserToken {
  private id!: string;
  private user_id!: string;
  private access_token!: string;
  private is_revoked!: boolean;
  private created_at!: number;
  private updated_at: number | null = null;

  public constructor(userToken: UserTokenModel) {
    this.setId(userToken.id);
    this.setUserId(userToken.user_id);
    this.setAccessToken(userToken.access_token);
    this.setIsRevoked(userToken.is_revoked);
    this.setCreatedAt(userToken.created_at);
    if (userToken.updated_at) this.setUpdatedAt(userToken.updated_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setUserId(userId: string): void {
    const rules = string().required();

    rules.validateSync(userId);

    this.user_id = userId;
  }

  public setAccessToken(accessToken: string): void {
    const rules = string().required();

    rules.validateSync(accessToken);

    this.access_token = accessToken;
  }

  public setIsRevoked(isRevoked: boolean): void {
    const rules = boolean().required();

    rules.validateSync(isRevoked);

    this.is_revoked = isRevoked;
  }

  public setCreatedAt(createdAt?: number): void {
    this.created_at = createdAt ? createdAt : Date.now();
  }

  public setUpdatedAt(updatedAt?: number | null): void {
    this.updated_at = typeof updatedAt !== "undefined" ? updatedAt : Date.now();
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getAccessToken(): string {
    return this.access_token;
  }

  public getIsRevoked(): boolean {
    return this.is_revoked;
  }

  public getCreatedAt(): number {
    return this.created_at;
  }

  public getUpdatedAt(): number | null {
    return this.updated_at;
  }
}

export default UserToken;
