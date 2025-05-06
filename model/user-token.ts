import { v7 as uuid } from "uuid";
import { boolean, number, string } from "yup";

export interface UserTokenModel {
  id?: string;
  refresh_token: string;
  access_token: string;
  is_revoked: boolean;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class UserToken {
  private id!: string;
  private refresh_token!: string;
  private access_token!: string;
  private is_revoked!: boolean;
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(userToken: UserTokenModel) {
    this.setId(userToken.id);
    this.setRefreshToken(userToken.refresh_token);
    this.setAccessToken(userToken.access_token);
    this.setIsRevoked(userToken.is_revoked);
    this.setCreatedAt(userToken.created_at);
    if (userToken.updated_at) this.setUpdatedAt(userToken.updated_at);
    if (userToken.deleted_at) this.setDeletedAt(userToken.deleted_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setRefreshToken(refreshToken: string): void {
    const rules = string().required();

    rules.validateSync(refreshToken);

    this.refresh_token = refreshToken;
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

  public setDeletedAt(deletedAt?: number | null): void {
    this.deleted_at = typeof deletedAt !== "undefined" ? deletedAt : Date.now();
  }

  public getId(): string {
    return this.id;
  }

  public getRefreshToken(): string {
    return this.refresh_token;
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

  public getDeletedAt(): number | null {
    return this.deleted_at;
  }
}

export default UserToken;
