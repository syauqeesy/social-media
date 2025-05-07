import { Comment } from "./comment";
import CommentModel from "../model/comment";
import { Queryable, Transactionable } from "../foundation/database";
import { PoolConnection } from "mysql2/promise";

describe("Comment Repository", () => {
  let commentRepo: Comment;

  const databaseMock: jest.Mocked<Queryable & Transactionable> = {
    transaction: jest.fn(),
    withConnection: jest.fn(),
    withTransaction: jest.fn(),
  };

  const tx: jest.Mocked<Partial<PoolConnection>> = {
    query: jest.fn().mockResolvedValue(undefined),
  };

  const now = Date.now();

  const mockCommentData = {
    id: "comment-1",
    post_id: "post-1",
    user_id: "user-1",
    content: "Test comment",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  beforeEach(() => {
    commentRepo = new Comment(databaseMock);
    commentRepo["database"] = {
      withConnection: jest.fn(),
      withTransaction: jest.fn(),
    };
  });

  it("should return comment by ID", async () => {
    (
      commentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[mockCommentData]]),
      });
    });

    const comment = await commentRepo.selectById("comment-1");
    expect(comment).toBeInstanceOf(CommentModel);
    expect(comment?.getId()).toBe("comment-1");
  });

  it("should return null if no comment found by ID", async () => {
    (
      commentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[]]),
      });
    });

    const comment = await commentRepo.selectById("not-found");
    expect(comment).toBeNull();
  });

  it("should insert a comment", async () => {
    const comment = new CommentModel(mockCommentData);

    (
      commentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue(undefined),
      });
    });

    await expect(commentRepo.insert(comment)).resolves.toBeUndefined();
  });

  it("should soft delete a comment", async () => {
    const comment = new CommentModel(mockCommentData);

    (
      commentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue(undefined),
      });
    });

    await expect(commentRepo.delete(comment)).resolves.toBeUndefined();
    expect(comment.getDeletedAt()).not.toBeNull();
  });

  it("should delete comments by post ID in transaction", async () => {
    await expect(
      commentRepo.deleteByPostIdTx(
        tx as unknown as jest.Mocked<PoolConnection>,
        "post-1"
      )
    ).resolves.toBeUndefined();
  });
});
