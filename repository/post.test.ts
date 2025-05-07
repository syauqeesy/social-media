import { Post } from "./post";
import PostModel from "../model/post";
import { Queryable, Transactionable } from "../foundation/database";
import { PoolConnection } from "mysql2/promise";

describe("Post Repository", () => {
  let postRepo: Post;

  const databaseMock: jest.Mocked<Queryable & Transactionable> = {
    transaction: jest.fn(),
    withConnection: jest.fn(),
    withTransaction: jest.fn(),
  };

  const tx: jest.Mocked<Partial<PoolConnection>> = {
    query: jest.fn().mockResolvedValue(undefined),
  };

  const now = Date.now();

  const mockPostData = {
    id: "post-1",
    user_id: "user-1",
    caption: "Test Caption",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  const mockUserData = {
    id: "user-1",
    username: "johndoe",
    password: "secret",
    avatar: "avatar.jpg",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  beforeEach(() => {
    postRepo = new Post(databaseMock);
    postRepo["database"] = {
      withConnection: jest.fn(),
      withTransaction: jest.fn(),
    };
  });

  it("should return paginated posts", async () => {
    (postRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest
            .fn()
            .mockResolvedValueOnce([[{ TOTAL_DATA: 1 }]])
            .mockResolvedValueOnce([[mockPostData]])
            .mockResolvedValueOnce([[mockUserData]])
            .mockResolvedValueOnce([[]]),
        });
      }
    );

    const [posts, total] = await postRepo.selectPaginate(
      1,
      10,
      "ASC",
      0,
      now,
      ""
    );
    expect(posts.length).toBe(1);
    expect(posts[0]).toBeInstanceOf(PostModel);
    expect(total).toBe(1);
  });

  it("should return null if post not found by ID", async () => {
    (postRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue([[]]),
        });
      }
    );

    const post = await postRepo.selectById("notfound-id");
    expect(post).toBeNull();
  });

  it("should insert a post", async () => {
    const newPost = new PostModel(mockPostData);

    (postRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue(undefined),
        });
      }
    );

    await expect(
      postRepo.insertTx(tx as unknown as jest.Mocked<PoolConnection>, newPost)
    ).resolves.toBeUndefined();
  });

  it("should insert a post with transaction", async () => {
    const newPost = new PostModel(mockPostData);
    await expect(
      postRepo.insertTx(tx as unknown as jest.Mocked<PoolConnection>, newPost)
    ).resolves.toBeUndefined();
  });

  it("should update a post", async () => {
    const updatedPost = new PostModel({ ...mockPostData, caption: "Updated" });

    (postRepo["database"].withConnection as jest.Mock).mockImplementationOnce(
      async (callback: any) => {
        return await callback({
          query: jest.fn().mockResolvedValue(undefined),
        });
      }
    );

    await expect(postRepo.update(updatedPost)).resolves.toBeUndefined();
  });

  it("should delete a post with transaction", async () => {
    const post = new PostModel(mockPostData);

    await expect(
      postRepo.deleteTx(tx as unknown as jest.Mocked<PoolConnection>, post)
    ).resolves.toBeUndefined();
  });
});
