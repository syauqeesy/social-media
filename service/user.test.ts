import { User } from "./user";
import UserModel from "../model/user";
import {
  PASSWORD_WRONG,
  USER_NOT_FOUND,
  USERNAME_ALREADY_USED,
} from "../exception/user";
import UserToken from "../model/user-token";
import { LoginRequest } from "../request/login";
import { RegisterRequest } from "../request/register";
import { EditUserRequest } from "./edit-user";
import { UNAUTHORIZED } from "../exception/common";
import { ShowUserRequest } from "../request/show-user";
import configuration from "../foundation/configuration";

describe("User Service", () => {
  let userService: User;
  let userRepositoryMock: any;
  let databaseMock: any;

  const mockUserData = {
    id: "user-1",
    username: "testuser",
    password: "password123",
    avatar: "avatar.png",
  };

  const mockLoginRequest: LoginRequest = {
    username: "testuser",
    password: "password123",
  };

  const mockRegisterRequest: RegisterRequest = {
    username: "testuser",
    password: "password123",
    avatar: "avatar.png",
  };

  const mockEditRequest: EditUserRequest = {
    avatar: "new-avatar.png",
    old_password: "password123",
    new_password: "newpassword123",
    new_password_confirmation: "newpassword123",
  };

  const mockShowUserRequest: ShowUserRequest = {
    id: "user-1",
  };

  beforeEach(() => {
    userRepositoryMock = {
      user: {
        selectByUsername: jest.fn(),
        selectById: jest.fn(),
        insert: jest.fn(),
        updateTx: jest.fn(),
        selectPaginate: jest.fn(),
      },
      userToken: {
        insert: jest.fn(),
        selectByUserIdAndIsRevoked: jest.fn(),
        delete: jest.fn(),
        deleteTx: jest.fn(),
      },
    };

    databaseMock = {
      transaction: jest.fn(),
    };

    userService = new User(configuration, userRepositoryMock, databaseMock);
  });

  it("should register a new user", async () => {
    userRepositoryMock.user.selectByUsername.mockResolvedValueOnce(null);
    userRepositoryMock.user.insert.mockResolvedValueOnce(undefined);

    const userInfo = await userService.register(mockRegisterRequest);

    expect(userRepositoryMock.user.selectByUsername).toHaveBeenCalledWith(
      mockRegisterRequest.username
    );
    expect(userRepositoryMock.user.insert).toHaveBeenCalled();
    expect(userInfo.username).toBe(mockRegisterRequest.username);
  });

  it("should throw USERNAME_ALREADY_USED if username already exists", async () => {
    userRepositoryMock.user.selectByUsername.mockResolvedValueOnce(
      mockUserData
    );

    await expect(userService.register(mockRegisterRequest)).rejects.toThrow(
      USERNAME_ALREADY_USED
    );
  });

  it("should login an existing user", async () => {
    const user = new UserModel(mockUserData);
    user.comparePassword = jest.fn().mockReturnValue(true);
    user.generateAccessToken = jest.fn().mockReturnValue("token123");
    userRepositoryMock.user.selectByUsername.mockResolvedValueOnce(user);
    userRepositoryMock.userToken.insert.mockResolvedValueOnce(undefined);

    const loginResponse = await userService.login(mockLoginRequest);

    expect(loginResponse.token).toBe("token123");
  });

  it("should throw USER_NOT_FOUND if user does not exist during login", async () => {
    userRepositoryMock.user.selectByUsername.mockResolvedValueOnce(null);

    await expect(userService.login(mockLoginRequest)).rejects.toThrow(
      USER_NOT_FOUND
    );
  });

  it("should throw PASSWORD_WRONG if password is incorrect during login", async () => {
    const user = new UserModel(mockUserData);
    user.comparePassword = jest.fn().mockReturnValue(false);
    userRepositoryMock.user.selectByUsername.mockResolvedValueOnce(user);

    await expect(userService.login(mockLoginRequest)).rejects.toThrow(
      PASSWORD_WRONG
    );
  });

  it("should show user info", async () => {
    const user = new UserModel(mockUserData);
    userRepositoryMock.user.selectById.mockResolvedValueOnce(user);

    const userInfo = await userService.show(mockShowUserRequest);

    expect(userRepositoryMock.user.selectById).toHaveBeenCalledWith(
      mockShowUserRequest.id
    );
    expect(userInfo.username).toBe(mockUserData.username);
  });

  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    userRepositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(userService.show(mockShowUserRequest)).rejects.toThrow(
      USER_NOT_FOUND
    );
  });

  it("should edit user info", async () => {
    const mockUser = new UserModel(mockUserData);
    mockUser.setAvatar = jest.fn();
    mockUser.setPassword = jest.fn();

    userRepositoryMock.user.selectById.mockResolvedValueOnce(mockUser);
    userRepositoryMock.user.updateTx.mockResolvedValueOnce(undefined);

    userRepositoryMock.userToken.selectByUserIdAndIsRevoked.mockResolvedValueOnce(
      null
    );

    await userService.edit(mockUser.getId(), mockEditRequest);

    expect(mockUser.setAvatar).toHaveBeenCalledWith(mockEditRequest.avatar);
  });

  it("should throw USER_NOT_FOUND if user to edit does not exist", async () => {
    userRepositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(
      userService.edit(mockUserData.id, mockEditRequest)
    ).rejects.toThrow(USER_NOT_FOUND);
  });

  it("should logout user", async () => {
    const user = new UserModel(mockUserData);
    const userToken = new UserToken({
      user_id: user.getId(),
      access_token: "token123",
      is_revoked: false,
    });
    userRepositoryMock.user.selectById.mockResolvedValueOnce(user);
    userRepositoryMock.userToken.selectByUserIdAndIsRevoked.mockResolvedValueOnce(
      userToken
    );
    userRepositoryMock.userToken.delete.mockResolvedValueOnce(undefined);

    await expect(userService.logout(mockUserData.id)).resolves.toBeUndefined();
  });

  it("should throw USER_NOT_FOUND if user does not exist during logout", async () => {
    userRepositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(userService.logout(mockUserData.id)).rejects.toThrow(
      USER_NOT_FOUND
    );
  });

  it("should throw UNAUTHORIZED if no valid token is found during logout", async () => {
    const user = new UserModel(mockUserData);
    userRepositoryMock.user.selectById.mockResolvedValueOnce(user);
    userRepositoryMock.userToken.selectByUserIdAndIsRevoked.mockResolvedValueOnce(
      null
    );

    await expect(userService.logout(mockUserData.id)).rejects.toThrow(
      UNAUTHORIZED
    );
  });
});
