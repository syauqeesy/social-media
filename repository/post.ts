import Repository from "./repository";
import PostModel from "../model/post";
import UserModel from "../model/user";
import CommentModel from "../model/comment";
import AttachmentModel from "../model/attachment";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface PostRepository {
  selectById(id: string): Promise<PostModel | null>;
  insertTx(tx: PoolConnection, post: PostModel): Promise<void>;
  update(post: PostModel): Promise<void>;
  deleteTx(tx: PoolConnection, post: PostModel): Promise<void>;
}

export class Post extends Repository implements PostRepository {
  public async selectById(id: string): Promise<PostModel | null> {
    return this.database.withConnection<PostModel | null>(
      async (poolConnection: PoolConnection): Promise<PostModel | null> => {
        const [postResults] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL LIMIT 1",
          [id]
        );

        if (postResults.length !== 1) return null;

        const post = new PostModel({
          id: postResults[0].id,
          user_id: postResults[0].user_id,
          caption: postResults[0].caption,
          attachments: [],
          comments: [],
          created_at: postResults[0].created_at,
          updated_at: postResults[0].updated_at,
          deleted_at: postResults[0].deleted_at,
        });

        const [userResults] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
          [post.getUserId()]
        );

        if (userResults.length !== 1) return null;

        const user = new UserModel({
          id: userResults[0].id,
          username: userResults[0].username,
          password: userResults[0].password,
          avatar: userResults[0].avatar,
          created_at: userResults[0].created_at,
          updated_at: userResults[0].updated_at,
          deleted_at: userResults[0].deleted_at,
        });

        post.setUser(user);

        const attachments: AttachmentModel[] = [];

        const [attachmentResults] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM attachments WHERE post_id = ? AND deleted_at IS NULL LIMIT 1",
          [post.getId()]
        );

        for (const result of attachmentResults) {
          attachments.push(
            new AttachmentModel({
              id: result.id,
              post_id: result.post_id,
              name: result.name,
              original_name: result.original_name,
              created_at: result.created_at,
              updated_at: result.updated_at,
              deleted_at: result.deleted_at,
            })
          );
        }

        post.setAttachments(attachments);

        const comments: CommentModel[] = [];
        const commentUserIds: string[] = [];

        const [commentResults] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM comments WHERE post_id = ? AND deleted_at IS NULL LIMIT 1",
          [post.getId()]
        );

        for (const result of commentResults) {
          commentUserIds.push(result.user_id);

          comments.push(
            new CommentModel({
              id: result.id,
              post_id: result.post_id,
              user_id: result.user_id,
              content: result.content,
              created_at: result.created_at,
              updated_at: result.updated_at,
              deleted_at: result.deleted_at,
            })
          );
        }

        if (commentUserIds.length > 0) {
          const userComments: { [key: string]: UserModel } = {};

          const [userCommentResults] = await poolConnection.query<
            RowDataPacket[]
          >("SELECT * FROM users WHERE id IN (?) AND deleted_at IS NULL", [
            commentUserIds,
          ]);

          for (const userComment of userCommentResults) {
            userComments[userComment.id] = new UserModel({
              id: userComment.id,
              username: userComment.username,
              password: userComment.password,
              avatar: userComment.avatar,
              created_at: userComment.created_at,
              updated_at: userComment.updated_at,
              deleted_at: userComment.deleted_at,
            });
          }

          for (const index in comments) {
            comments[index].setUser(userComments[comments[index].getUserId()]);
          }

          post.setComments(comments);
        }

        return post;
      }
    );
  }

  public async insertTx(tx: PoolConnection, post: PostModel): Promise<void> {
    return this.database.withTransaction<void>(
      tx,
      async (tx: PoolConnection): Promise<void> => {
        await tx.query(
          "INSERT INTO posts (id, user_id, caption, created_at) VALUES (?, ?, ?, ?)",
          [
            post.getId(),
            post.getUserId(),
            post.getCaption(),
            post.getCreatedAt(),
          ]
        );
      }
    );
  }

  public async update(post: PostModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        post.setUpdatedAt();

        await poolConnection.query(
          "UPDATE posts SET caption = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL",
          [post.getCaption(), post.getUpdatedAt(), post.getId()]
        );
      }
    );
  }

  public async deleteTx(tx: PoolConnection, post: PostModel): Promise<void> {
    return this.database.withTransaction<void>(
      tx,
      async (tx: PoolConnection): Promise<void> => {
        post.setDeletedAt();

        await tx.query(
          "UPDATE posts SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
          [post.getDeletedAt(), post.getId()]
        );
      }
    );
  }
}
