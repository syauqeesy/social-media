import { Post } from "./post";
import PostModel from "../model/post";
import { USER_NOT_FOUND } from "../exception/user";
import { POST_NOT_FOUND } from "../exception/post";
import configuration from "../foundation/configuration";
import { CreatePostRequest } from "../request/create-post";
import { EditPostRequest } from "../request/edit-post";
import { DeletePostRequest } from "../request/delete-post";
import { PaginationRequest } from "../request/pagination";
import { ShowPostRequest } from "./show-post";
import User from "../model/user";

describe("Post Service", () => {
  let postService: Post;
  let repositoryMock: any;
  let databaseMock: any;

  const userId = "user-1";
  const postId = "post-1";

  const mockUserData = {
    id: "user-1",
    username: "testuser",
    password: "password123",
    avatar: "avatar.png",
  };

  const mockPost = new PostModel({
    id: postId,
    user_id: userId,
    caption: "Hello",
  });
  mockPost.getUserId = () => userId;
  mockPost.getInfo = jest
    .fn()
    .mockReturnValue({ id: postId, caption: "Hello" });
  mockPost.setCaption = jest.fn();
  mockPost.setUser = jest.fn();
  mockPost.setAttachments = jest.fn();
  mockPost.setComments = jest.fn();
  mockPost.getPaginatedInfo = jest
    .fn()
    .mockReturnValue({ id: postId, caption: "Hello" });

  const mockCreateRequest: CreatePostRequest = {
    caption: "New Post",
    attachments: [
      {
        name: "file1.jpg",
        original_name: "original1.jpg",
      },
    ],
  };

  const mockEditRequest: EditPostRequest = {
    id: postId,
    caption: "Updated Caption",
  };

  const mockDeleteRequest: DeletePostRequest = {
    id: postId,
  };

  const mockShowRequest: ShowPostRequest = {
    id: postId,
  };

  const mockPaginationRequest: PaginationRequest = {
    page: 1,
    limit: 10,
    sort: "DESC",
    from: "2025-05-07",
    to: "2025-05-07",
    q: "",
  };

  beforeEach(() => {
    repositoryMock = {
      user: {
        selectById: jest.fn(),
      },
      post: {
        selectById: jest.fn(),
        selectPaginate: jest.fn(),
        insertTx: jest.fn(),
        update: jest.fn(),
        deleteTx: jest.fn(),
      },
      attachment: {
        insertBatchTx: jest.fn(),
        deleteByPostIdTx: jest.fn(),
      },
      comment: {
        deleteByPostIdTx: jest.fn(),
      },
    };

    databaseMock = {
      transaction: jest.fn((cb) => cb({})),
    };

    postService = new Post(configuration, repositoryMock, databaseMock);
  });

  it("should list posts with pagination", async () => {
    repositoryMock.post.selectPaginate.mockResolvedValueOnce([[mockPost], 1]);

    const [posts, pageInfo] = await postService.list(mockPaginationRequest);

    expect(posts.length).toBe(1);
    expect(posts[0].id).toBe(postId);
    expect(pageInfo.total).toBe(1);
  });

  it("should show a post by id", async () => {
    repositoryMock.post.selectById.mockResolvedValueOnce(mockPost);

    const post = await postService.show(mockShowRequest);

    expect(post.id).toBe(postId);
  });

  it("should throw POST_NOT_FOUND if post not found in show", async () => {
    repositoryMock.post.selectById.mockResolvedValueOnce(null);

    await expect(postService.show(mockShowRequest)).rejects.toThrow(
      POST_NOT_FOUND
    );
  });

  it("should create a new post with attachments", async () => {
    const user = new User(mockUserData);

    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.insertTx.mockResolvedValueOnce(undefined);
    repositoryMock.attachment.insertBatchTx.mockResolvedValueOnce(undefined);

    const result = await postService.create(userId, mockCreateRequest);

    expect(result.caption).toBe(mockCreateRequest.caption);
    expect(repositoryMock.post.insertTx).toHaveBeenCalled();
    expect(repositoryMock.attachment.insertBatchTx).toHaveBeenCalled();
  });

  it("should throw USER_NOT_FOUND if user not found in create", async () => {
    repositoryMock.user.selectById.mockResolvedValueOnce(null);

    await expect(postService.create(userId, mockCreateRequest)).rejects.toThrow(
      USER_NOT_FOUND
    );
  });

  it("should edit a post", async () => {
    const user = new User(mockUserData);
    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.selectById.mockResolvedValueOnce(mockPost);
    repositoryMock.post.update.mockResolvedValueOnce(undefined);

    const result = await postService.edit(userId, mockEditRequest);

    expect(result.caption).toBe("Hello");
    expect(repositoryMock.post.update).toHaveBeenCalled();
  });

  it("should delete a post", async () => {
    const user = new User(mockUserData);
    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.selectById.mockResolvedValueOnce(mockPost);

    await postService.delete(userId, mockDeleteRequest);

    expect(repositoryMock.comment.deleteByPostIdTx).toHaveBeenCalled();
    expect(repositoryMock.attachment.deleteByPostIdTx).toHaveBeenCalled();
    expect(repositoryMock.post.deleteTx).toHaveBeenCalled();
  });

  it("should throw POST_NOT_FOUND if user mismatch in edit", async () => {
    const wrongPost = new PostModel({
      id: postId,
      user_id: "another-user",
      caption: "asdasdsa",
    });
    wrongPost.getUserId = () => "another-user";
    const user = new User(mockUserData);

    repositoryMock.user.selectById.mockResolvedValueOnce(user);
    repositoryMock.post.selectById.mockResolvedValueOnce(wrongPost);

    await expect(postService.edit(userId, mockEditRequest)).rejects.toThrow(
      POST_NOT_FOUND
    );
  });
});
