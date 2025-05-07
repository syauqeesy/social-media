import { UserToken } from "./user-token";
import UserTokenModel from "../model/user-token";
import { Queryable, Transactionable } from "../foundation/database";
import { PoolConnection } from "mysql2/promise";

describe("UserToken Repository", () => {
  let userTokenRepo: UserToken;

  const databaseMock: jest.Mocked<Queryable & Transactionable> = {
    transaction: jest.fn(),
    withConnection: jest.fn(),
    withTransaction: jest.fn(),
  };

  const tx: jest.Mocked<Partial<PoolConnection>> = {
    query: jest.fn().mockResolvedValue(undefined),
  };

  const mockTokenData = {
    id: "token-1",
    user_id: "user-1",
    access_token: "access-token-abc",
    is_revoked: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  beforeEach(() => {
    userTokenRepo = new UserToken(databaseMock);
    userTokenRepo["database"] = {
      withConnection: jest.fn(),
      withTransaction: jest.fn(),
    };
  });

  it("should return user token by user id and is_revoked", async () => {
    (
      userTokenRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[mockTokenData]]),
      });
    });

    const result = await userTokenRepo.selectByUserIdAndIsRevoked(
      "user-1",
      false
    );
    expect(result).toBeInstanceOf(UserTokenModel);
    expect(result?.getUserId()).toBe("user-1");
  });

  it("should return null when no user token found", async () => {
    (
      userTokenRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[]]),
      });
    });

    const result = await userTokenRepo.selectByUserIdAndIsRevoked(
      "notfound",
      true
    );
    expect(result).toBeNull();
  });

  it("should insert a new user token", async () => {
    const newToken = new UserTokenModel({
      id: "token-2",
      user_id: "user-2",
      access_token: "new-access-token",
      is_revoked: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    (
      userTokenRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue(undefined),
      });
    });

    await expect(userTokenRepo.insert(newToken)).resolves.toBeUndefined();
  });

  it("should update an existing user token", async () => {
    const updatedToken = new UserTokenModel({
      ...mockTokenData,
      is_revoked: true,
    });

    (
      userTokenRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue(undefined),
      });
    });

    await expect(userTokenRepo.update(updatedToken)).resolves.toBeUndefined();
  });

  it("should delete a user token", async () => {
    const deleteToken = new UserTokenModel(mockTokenData);

    (
      userTokenRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue(undefined),
      });
    });

    await expect(userTokenRepo.delete(deleteToken)).resolves.toBeUndefined();
  });

  it("should delete a user token with transaction", async () => {
    const deleteToken = new UserTokenModel(mockTokenData);
    await expect(
      userTokenRepo.deleteTx(
        tx as unknown as jest.Mocked<PoolConnection>,
        deleteToken
      )
    ).resolves.toBeUndefined();
  });
});
