import { User } from "./user";
import UserModel from "../model/user";
import { Queryable, Transactionable } from "../foundation/database";
import { PoolConnection } from "mysql2/promise";

describe("User Repository", () => {
  let userRepo: User;

  const databaseMock: jest.Mocked<Queryable & Transactionable> = {
    transaction: jest.fn(),
    withConnection: jest.fn(),
    withTransaction: jest.fn(),
  };

  const tx: jest.Mocked<Partial<PoolConnection>> = {
    query: jest.fn().mockResolvedValue(undefined),
  };

  const mockUserData = {
    id: "1",
    username: "testuser",
    password: "hashedpass",
    avatar: "avatar.png",
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: null,
  };

  beforeEach(() => {
    userRepo = new User(databaseMock);
    userRepo["database"] = {
      withConnection: jest.fn(),
      withTransaction: jest.fn(),
    };
  });

  it("should return user by username", async () => {
    (userRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue([[mockUserData]]),
        });
      }
    );

    const result = await userRepo.selectByUsername("testuser");
    expect(result).toBeInstanceOf(UserModel);
    expect(result?.getUsername()).toBe("testuser");
  });

  it("should return null when user is not found", async () => {
    (userRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue([[]]),
        });
      }
    );

    const result = await userRepo.selectByUsername("notfound");
    expect(result).toBeNull();
  });

  it("should return user by id", async () => {
    (userRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue([[mockUserData]]),
        });
      }
    );

    const result = await userRepo.selectById("1");
    expect(result).toBeInstanceOf(UserModel);
    expect(result?.getId()).toBe("1");
  });

  it("should return null when id is not found", async () => {
    (userRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue([[]]),
        });
      }
    );

    const result = await userRepo.selectById("notfound");
    expect(result).toBeNull();
  });

  it("should insert a new user", async () => {
    const insertUser = new UserModel({
      id: "1",
      username: "newuser",
      password: "newpass",
      avatar: "avatar.png",
      created_at: Date.now(),
      updated_at: Date.now(),
      deleted_at: null,
    });

    (userRepo["database"].withTransaction as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue(undefined),
        });
      }
    );

    await expect(userRepo.insert(insertUser)).resolves.toBeUndefined();
  });

  it("should update an existing user", async () => {
    const updatedUser = new UserModel({
      ...mockUserData,
      avatar: "updated.png",
    });

    await expect(
      userRepo.updateTx(
        tx as unknown as jest.Mocked<PoolConnection>,
        updatedUser
      )
    ).resolves.toBeUndefined();
  });
});
