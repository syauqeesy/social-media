import { v7 as uuid } from "uuid";
import { string } from "yup";
import {
  genSaltSync as genSalt,
  hashSync as hash,
  compareSync,
} from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { UserInfo } from "../type/user";
import { INVALID_APPLICATION_SECRET, USER_NOT_FOUND } from "../exception/user";

interface UserModel {
  id?: string;
  username: string;
  password?: string;
  avatar: string;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class User {
  private id!: string;
  private username!: string;
  private password!: string;
  private avatar!: string;
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(user: UserModel) {
    this.setId(user.id);
    this.setUsername(user.username);
    if (user.password) this.password = user.password;
    this.setAvatar(user.avatar);
    this.setCreatedAt(user.created_at);
    if (user.updated_at) this.setUpdatedAt(user.updated_at);
    if (user.deleted_at) this.setDeletedAt(user.deleted_at);
  }

  public comparePassword(password: string): boolean {
    return compareSync(password, this.getPassword());
  }

  public generateAccessToken(secret: string): string {
    if (!this.getId()) throw USER_NOT_FOUND;

    if (!secret) throw INVALID_APPLICATION_SECRET;

    const signature = jsonwebtoken.sign(
      {
        user_id: this.getId(),
      },
      secret,
      {
        expiresIn: Math.floor(Date.now() / 1000 + 60 * 60),
      }
    );

    return signature;
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setUsername(username: string): void {
    const rules = string()
      .min(3)
      .max(24)
      .matches(/^[a-z0-9]+$/);

    rules.validateSync(username);

    this.username = username;
  }

  public setPassword(password: string): void {
    const rules = string().min(3).max(72);

    rules.validateSync(password);

    const salt = genSalt(10);

    this.password = hash(password, salt);
  }

  public setAvatar(avatar: string): void {
    const rules = string().required();

    rules.validateSync(avatar);

    this.avatar = avatar;
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

  public getUsername(): string {
    return this.username;
  }

  public getAvatar(): string | null {
    return this.avatar;
  }

  public getPassword(): string {
    return this.password;
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

  public getInfo(baseUrl: string): UserInfo {
    const info: UserInfo = {
      id: this.getId(),
      username: this.getUsername(),
      avatar: baseUrl + "/storage/avatar/" + this.getAvatar(),
      created_at: this.getCreatedAt(),
    };

    return info;
  }
}

export default User;
