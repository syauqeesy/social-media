import Repository from "./repository";
import UserModel from "../model/user";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface UserRepository {
  selectPaginate(
    page: number,
    limit: number,
    sort: "ASC" | "DESC",
    from: number,
    to: number,
    q: string
  ): Promise<[UserModel[], number]>;
  selectByUsername(username: string): Promise<UserModel | null>;
  selectById(id: string): Promise<UserModel | null>;
  insert(user: UserModel): Promise<void>;
  updateTx(tx: PoolConnection, user: UserModel): Promise<void>;
}

export class User extends Repository implements UserRepository {
  public async selectPaginate(
    page: number,
    limit: number,
    sort: "ASC" | "DESC",
    from: number,
    to: number,
    q: string
  ): Promise<[UserModel[], number]> {
    return this.database.withConnection<[UserModel[], number]>(
      async (
        poolConnection: PoolConnection
      ): Promise<[UserModel[], number]> => {
        const [resultCount] = await poolConnection.query<RowDataPacket[]>(
          `SELECT COUNT(*) AS TOTAL_DATA FROM users WHERE LOWER(username) LIKE ? AND created_at BETWEEN ? AND ? AND deleted_at IS NULL ORDER BY created_at ${sort}`,
          [`%${q.toLowerCase()}%`, from, to]
        );

        const total =
          resultCount.length > 0 && resultCount[0].TOTAL_DATA
            ? Number(resultCount[0].TOTAL_DATA)
            : 0;

        const users: UserModel[] = [];

        const [results] = await poolConnection.query<RowDataPacket[]>(
          `SELECT * FROM users WHERE LOWER(username) LIKE ? AND created_at BETWEEN ? AND ? AND deleted_at IS NULL ORDER BY created_at ${sort} LIMIT ? OFFSET ?`,
          [
            `%${q.toLowerCase()}%`,
            from,
            to,
            limit,
            page === 1 ? page - 1 : page,
          ]
        );

        for (const user of results) {
          users.push(
            new UserModel({
              id: user.id,
              username: user.username,
              password: user.password,
              avatar: user.avatar,
              created_at: user.created_at,
              updated_at: user.updated_at,
              deleted_at: user.deleted_at,
            })
          );
        }

        return [users, total];
      }
    );
  }

  public async selectByUsername(username: string): Promise<UserModel | null> {
    return this.database.withConnection<UserModel | null>(
      async (poolConnection: PoolConnection): Promise<UserModel | null> => {
        const [results] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE username = ? AND deleted_at IS NULL LIMIT 1",
          [username]
        );

        if (results.length !== 1) return null;

        const user = new UserModel({
          id: results[0].id,
          username: results[0].username,
          password: results[0].password,
          avatar: results[0].avatar,
          created_at: results[0].created_at,
          updated_at: results[0].updated_at,
          deleted_at: results[0].deleted_at,
        });

        return user;
      }
    );
  }

  public async selectById(id: string): Promise<UserModel | null> {
    return this.database.withConnection<UserModel | null>(
      async (poolConnection: PoolConnection): Promise<UserModel | null> => {
        const [results] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
          [id]
        );

        if (results.length !== 1) return null;

        const user = new UserModel({
          id: results[0].id,
          username: results[0].username,
          password: results[0].password,
          avatar: results[0].avatar,
          created_at: results[0].created_at,
          updated_at: results[0].updated_at,
          deleted_at: results[0].deleted_at,
        });

        return user;
      }
    );
  }

  public async insert(user: UserModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        await poolConnection.query(
          "INSERT INTO users (id, username, password, avatar, created_at) VALUES (?, ?, ?, ?, ?)",
          [
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            user.getAvatar(),
            user.getCreatedAt(),
          ]
        );
      }
    );
  }

  public async updateTx(tx: PoolConnection, user: UserModel): Promise<void> {
    return this.database.withTransaction<void>(
      tx,
      async (tx: PoolConnection): Promise<void> => {
        user.setUpdatedAt();

        await tx.query(
          "UPDATE users SET password = ?, avatar = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL",
          [
            user.getPassword(),
            user.getAvatar(),
            user.getUpdatedAt(),
            user.getId(),
          ]
        );
      }
    );
  }
}
