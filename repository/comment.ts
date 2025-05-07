import Repository from "./repository";
import CommentModel from "../model/comment";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface CommentRepository {
  selectById(id: string): Promise<CommentModel | null>;
  insert(comment: CommentModel): Promise<void>;
  delete(comment: CommentModel): Promise<void>;
  deleteByPostIdTx(tx: PoolConnection, postId: string): Promise<void>;
}

export class Comment extends Repository implements CommentRepository {
  public async selectById(id: string): Promise<CommentModel | null> {
    return this.database.withConnection<CommentModel | null>(
      async (poolConnection: PoolConnection): Promise<CommentModel | null> => {
        const [results] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL",
          [id]
        );

        if (results.length !== 1) return null;

        const comment = new CommentModel({
          id: results[0].id,
          post_id: results[0].post_id,
          user_id: results[0].user_id,
          content: results[0].content,
          created_at: results[0].created_at,
          updated_at: results[0].updated_at,
          deleted_at: results[0].deleted_at,
        });

        return comment;
      }
    );
  }

  public async insert(comment: CommentModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        await poolConnection.query(
          "INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)",
          [
            comment.getId(),
            comment.getPostId(),
            comment.getUserId(),
            comment.getContent(),
            comment.getCreatedAt(),
          ]
        );
      }
    );
  }

  public async delete(comment: CommentModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        comment.setDeletedAt();

        await poolConnection.query(
          "UPDATE comments SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
          [comment.getDeletedAt(), comment.getId()]
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
          "UPDATE comments SET deleted_at = ? WHERE post_id = ? AND deleted_at IS NULL",
          [Date.now(), postId]
        );
      }
    );
  }
}
