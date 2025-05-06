import { v7 as uuid } from "uuid";
import { string } from "yup";
import { AttachmentInfo } from "../type/attachment";

export interface AttachmentModel {
  id?: string;
  post_id: string;
  name: string;
  original_name: string;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

class Attachment {
  private id!: string;
  private post_id!: string;
  private name!: string;
  private original_name!: string;
  private created_at!: number;
  private updated_at: number | null = null;
  private deleted_at: number | null = null;

  public constructor(attachment: AttachmentModel) {
    this.setId(attachment.id);
    this.setPostId(attachment.post_id);
    this.setName(attachment.name);
    this.setOriginalName(attachment.original_name);
    this.setCreatedAt(attachment.created_at);
    if (attachment.updated_at) this.setUpdatedAt(attachment.updated_at);
    if (attachment.deleted_at) this.setDeletedAt(attachment.deleted_at);
  }

  public setId(id?: string): void {
    this.id = id ? id : uuid();
  }

  public setPostId(refreshToken: string): void {
    const rules = string().required();

    rules.validateSync(refreshToken);

    this.post_id = refreshToken;
  }

  public setName(accessToken: string): void {
    const rules = string().required();

    rules.validateSync(accessToken);

    this.name = accessToken;
  }

  public setOriginalName(isRevoked: string): void {
    const rules = string().required();

    rules.validateSync(isRevoked);

    this.original_name = isRevoked;
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

  public getName(): string {
    return this.name;
  }

  public getOriginalName(): string {
    return this.original_name;
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

  public getInfo(baseUrl: string): AttachmentInfo {
    const info: AttachmentInfo = {
      id: this.getId(),
      url: this.getName(),
      original_name: baseUrl + "/assets/attachment/" + this.getOriginalName(),
    };

    return info;
  }
}

export default Attachment;
