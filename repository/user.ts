import Repository from "./repository";
import UserModel from "../model/user";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface UserRepository {
  selectByUsername(username: string): Promise<UserModel | null>;
  selectById(id: string): Promise<UserModel | null>;
  insert(user: UserModel): Promise<void>;
  update(user: UserModel): Promise<void>;
}

export class User extends Repository implements UserRepository {
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

  public async update(user: UserModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        await poolConnection.query(
          "UPDATE users SET password = ?, avatar = ? WHERE id = ? AND deleted_at IS NULL",
          [user.getPassword(), user.getAvatar(), user.getId()]
        );
      }
    );
  }
}
