import Repository from "./repository";
import AttachmentModel from "../model/attachment";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface AttachmentRepository {
  selectByPostId(postId: string): Promise<AttachmentModel[]>;
  insertBatchTx(
    tx: PoolConnection,
    attachments: AttachmentModel[]
  ): Promise<void>;
  deleteByPostIdTx(tx: PoolConnection, postId: string): Promise<void>;
}

export class Attachment extends Repository implements AttachmentRepository {
  public async selectByPostId(postId: string): Promise<AttachmentModel[]> {
    return this.database.withConnection<AttachmentModel[]>(
      async (poolConnection: PoolConnection): Promise<AttachmentModel[]> => {
        const attachments: AttachmentModel[] = [];
        const [results] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM attachments WHERE post_id = ? AND deleted_at IS NULL LIMIT 1",
          [postId]
        );

        for (const result of results) {
          attachments.push(
            new AttachmentModel({
              id: result[0].id,
              post_id: result[0].post_id,
              name: result[0].name,
              original_name: result[0].original_name,
              created_at: result[0].created_at,
              updated_at: result[0].updated_at,
              deleted_at: result[0].deleted_at,
            })
          );
        }

        return attachments;
      }
    );
  }

  public async insertBatchTx(
    tx: PoolConnection,
    attachments: AttachmentModel[]
  ): Promise<void> {
    return this.database.withTransaction<void>(
      tx,
      async (tx: PoolConnection): Promise<void> => {
        await tx.query(
          "INSERT INTO attachments (id, post_id, name, original_name, created_at) VALUES ?",
          [
            attachments.map((attachment) => [
              attachment.getId(),
              attachment.getPostId(),
              attachment.getName(),
              attachment.getOriginalName(),
              attachment.getCreatedAt(),
            ]),
          ]
        );
      }
    );
  }

  public async deleteByPostIdTx(
    tx: PoolConnection,
    postId: string
  ): Promise<void> {
    return this.database.withTransaction<void>(
      tx,
      async (tx: PoolConnection): Promise<void> => {
        await tx.query(
          "UPDATE attachments SET deleted_at = ? WHERE post_id = ? AND deleted_at IS NULL",
          [Date.now(), postId]
        );
      }
    );
  }
}
