import Service from "./service";
import { LoginResponse, UserInfo } from "../type/user";
import { RegisterRequest } from "../request/register";
import UserModel from "../model/user";
import UserToken from "../model/user-token";

import {
  PASSWORD_WRONG,
  USER_NOT_FOUND,
  USERNAME_ALREADY_USED,
} from "../exception/user";
import { LoginRequest } from "../request/login";
import { EditUserRequest } from "./edit-user";
import { UNAUTHORIZED } from "../exception/common";
import { PoolConnection } from "mysql2/promise";
import { PaginationRequest } from "../request/pagination";
import { PaginationInfo } from "../type/common";
import { dateHandler, paginationHelper } from "../foundation/helper";
import { ShowUserRequest } from "../request/show-user";

export interface UserService {
  list(request: PaginationRequest): Promise<[UserInfo[], PaginationInfo]>;
  register(request: RegisterRequest): Promise<UserInfo>;
  login(request: LoginRequest): Promise<LoginResponse>;
  show(request: ShowUserRequest): Promise<UserInfo>;
  edit(userId: string, request: EditUserRequest): Promise<UserInfo>;
  logout(userId: string): Promise<void>;
}

export class User extends Service implements UserService {
  public async list(
    request: PaginationRequest
  ): Promise<[UserInfo[], PaginationInfo]> {
    const paginatedUserInfos: UserInfo[] = [];

    const [users, total] = await this.repository.user.selectPaginate(
      request.page,
      request.limit,
      request.sort,
      dateHandler(request.from),
      dateHandler(request.to, true),
      request.q ? request.q : ""
    );

    for (const user of users) {
      paginatedUserInfos.push(
        user.getInfo(this.configuration.application.base_url)
      );
    }

    return [
      paginatedUserInfos,
      paginationHelper(total, request.page, request.limit),
    ];
  }

  public async register(request: RegisterRequest): Promise<UserInfo> {
    const alreadyExist = await this.repository.user.selectByUsername(
      request.username
    );

    if (alreadyExist !== null) throw USERNAME_ALREADY_USED;

    const user = new UserModel({
      username: request.username,
      avatar: request.avatar,
    });

    user.setPassword(request.password);

    await this.repository.user.insert(user);

    return user.getInfo(this.configuration.application.base_url);
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.repository.user.selectByUsername(request.username);

    if (user === null) throw USER_NOT_FOUND;

    if (!user.comparePassword(request.password)) throw PASSWORD_WRONG;

    const signature = user.generateAccessToken(
      this.configuration.application.secret
    );

    const userToken = new UserToken({
      user_id: user.getId(),
      access_token: signature,
      is_revoked: false,
    });

    await this.repository.userToken.insert(userToken);

    return {
      token: signature,
    };
  }

  public async show(request: ShowUserRequest): Promise<UserInfo> {
    const user = await this.repository.user.selectById(request.id);

    if (user === null) throw USER_NOT_FOUND;

    return user.getInfo(this.configuration.application.base_url);
  }

  public async edit(
    userId: string,
    request: EditUserRequest
  ): Promise<UserInfo> {
    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    if (request.avatar) user.setAvatar(request.avatar);

    await this.database.transaction(
      async (tx: PoolConnection): Promise<void> => {
        if (request.old_password && request.new_password_confirmation) {
          if (!user.comparePassword(request.old_password)) throw PASSWORD_WRONG;

          user.setPassword(request.new_password_confirmation);

          const userToken =
            await this.repository.userToken.selectByUserIdAndIsRevoked(
              user.getId(),
              false
            );

          if (!userToken) throw UNAUTHORIZED;

          await this.repository.userToken.deleteTx(tx, userToken);
        }

        await this.repository.user.updateTx(tx, user);
      }
    );

    return user.getInfo(this.configuration.application.base_url);
  }

  public async logout(userId: string): Promise<void> {
    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    const userToken =
      await this.repository.userToken.selectByUserIdAndIsRevoked(
        user.getId(),
        false
      );

    if (!userToken) throw UNAUTHORIZED;

    await this.repository.userToken.delete(userToken);
  }
}
