import Repository from "./repository";
import UserTokenModel from "../model/user-token";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface UserTokenRepository {
  selectByUserIdAndIsRevoked(
    userId: string,
    isRevoked: boolean
  ): Promise<UserTokenModel | null>;
  insert(userToken: UserTokenModel): Promise<void>;
  update(userToken: UserTokenModel): Promise<void>;
  delete(userToken: UserTokenModel): Promise<void>;
}

export class UserToken extends Repository implements UserTokenRepository {
  public async selectByUserIdAndIsRevoked(
    userId: string,
    isRevoked: boolean
  ): Promise<UserTokenModel | null> {
    return this.database.withConnection<UserTokenModel | null>(
      async (
        poolConnection: PoolConnection
      ): Promise<UserTokenModel | null> => {
        const [results] = await poolConnection.query<RowDataPacket[]>(
          "SELECT * FROM user_tokens WHERE user_id = ? AND is_revoked = ?",
          [userId, isRevoked]
        );

        if (results.length !== 1) return null;

        const user = new UserTokenModel({
          id: results[0].id,
          user_id: results[0].user_id,
          access_token: results[0].access_token,
          is_revoked: results[0].is_revoked,
          created_at: results[0].created_at,
          updated_at: results[0].updated_at,
        });

        return user;
      }
    );
  }

  public async insert(userToken: UserTokenModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        await poolConnection.query(
          "INSERT INTO user_tokens (id, user_id, access_token, is_revoked, created_at) VALUES (?, ?, ?, ?, ?)",
          [
            userToken.getId(),
            userToken.getUserId(),
            userToken.getAccessToken(),
            userToken.getIsRevoked(),
            userToken.getCreatedAt(),
          ]
        );
      }
    );
  }

  public async update(userToken: UserTokenModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        userToken.setUpdatedAt();

        await poolConnection.query(
          "UPDATE user_tokens SET is_revoked = ?, updated_at = ? WHERE id = ?",
          [
            userToken.getIsRevoked(),
            userToken.getUpdatedAt(),
            userToken.getId(),
          ]
        );
      }
    );
  }

  public async delete(userToken: UserTokenModel): Promise<void> {
    return this.database.withConnection<void>(
      async (poolConnection: PoolConnection): Promise<void> => {
        await poolConnection.query("DELETE FROM user_tokens WHERE id = ?", [
          userToken.getId(),
        ]);
      }
    );
  }
}
