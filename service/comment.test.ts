import { Comment } from "./comment";
import CommentModel from "../model/comment";
import { USER_NOT_FOUND } from "../exception/user";
import { POST_NOT_FOUND } from "../exception/post";
import { COMMENT_NOT_FOUND } from "../exception/comment";
import configuration from "../foundation/configuration";
import { CreateCommentRequest } from "../request/create-comment";
import { DeleteCommentRequest } from "../request/delete-comment";
import User from "../model/user";
import PostModel from "../model/post";

describe("Comment Service", () => {
  let commentService: Comment;
  let repositoryMock: any;
  let databaseMock: any;

  const userId = "user-1";
  const postId = "post-1";
  const commentId = "comment-1";

  const mockUserData = {
    id: userId,
    username: "testuser",
    password: "password123",
    avatar: "avatar.png",
  };

  const mockCreateRequest: CreateCommentRequest = {
    post_id: postId,
    content: "Nice post!",
  };

  const mockDeleteRequest: DeleteCommentRequest = {
    id: commentId,
  };

  const mockPost = new PostModel({
    id: postId,
    user_id: userId,
    caption: "Hello",
  });
  const mockComment = new CommentModel({
    id: commentId,
    post_id: postId,
    user_id: userId,
    content: "Nice post!",
  });

  mockComment.getUserId = () => userId;
  mockComment.getInfo = jest
    .fn()
    .mockReturnValue({ id: commentId, content: "Nice post!" });
  mockComment.setUser = jest.fn();

  beforeEach(() => {
    repositoryMock = {
      user: {
        selectById: jest.fn(),
      },
      post: {
        selectById: jest.fn(),
      },
      comment: {
        insert: jest.fn(),
        selectById: jest.fn(),
        delete: jest.fn(),
      },
    };

    databaseMock = {}; // Not used in comment service
    commentService = new Comment(configuration, repositoryMock, databaseMock);
  });

  it("should create a new comment", async () => {
    const user = new User(mockUserData);

    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.selectById.mockResolvedValueOnce(mockPost);
    repositoryMock.comment.insert.mockResolvedValueOnce(undefined);

    const result = await commentService.create(userId, mockCreateRequest);

    expect(result.content).toBe("Nice post!");
    expect(repositoryMock.comment.insert).toHaveBeenCalled();
  });

  it("should throw USER_NOT_FOUND in create if user not found", async () => {
    repositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(
      commentService.create(userId, mockCreateRequest)
    ).rejects.toThrow(USER_NOT_FOUND);
  });

  it("should throw POST_NOT_FOUND in create if post not found", async () => {
    const user = new User(mockUserData);
    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.selectById.mockResolvedValueOnce(null);

    await expect(
      commentService.create(userId, mockCreateRequest)
    ).rejects.toThrow(POST_NOT_FOUND);
  });

  it("should delete a comment", async () => {
    const user = new User(mockUserData);
    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.comment.selectById.mockResolvedValueOnce(mockComment);

    await commentService.delete(userId, mockDeleteRequest);

    expect(repositoryMock.comment.delete).toHaveBeenCalled();
  });

  it("should throw USER_NOT_FOUND in delete if user not found", async () => {
    repositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(
      commentService.delete(userId, mockDeleteRequest)
    ).rejects.toThrow(USER_NOT_FOUND);
  });

  it("should throw COMMENT_NOT_FOUND if comment not found in delete", async () => {
    const user = new User(mockUserData);
    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.comment.selectById.mockResolvedValueOnce(null);

    await expect(
      commentService.delete(userId, mockDeleteRequest)
    ).rejects.toThrow(COMMENT_NOT_FOUND);
  });

  it("should throw COMMENT_NOT_FOUND if comment user_id mismatch in delete", async () => {
    const user = new User(mockUserData);
    const mismatchedComment = new CommentModel({
      id: commentId,
      post_id: postId,
      user_id: "another-user",
      content: "Bad",
    });
    mismatchedComment.getUserId = () => "another-user";

    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.comment.selectById.mockResolvedValueOnce(mismatchedComment);

    await expect(
      commentService.delete(userId, mockDeleteRequest)
    ).rejects.toThrow(COMMENT_NOT_FOUND);
  });
});
