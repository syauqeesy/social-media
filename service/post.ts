import { CreatePostRequest } from "../request/create-post";
import { EditPostRequest } from "../request/edit-post";
import { DeletePostRequest } from "../request/delete-post";
import { PaginationRequest } from "../request/pagination";
import { ShowPostRequest } from "./show-post";
import { PaginatedPostInfo, PostInfo } from "../type/post";
import PostModel from "../model/post";
import AttachmentModel from "../model/attachment";
import Service from "./service";
import { USER_NOT_FOUND } from "../exception/user";
import { POST_NOT_FOUND } from "../exception/post";
import { PoolConnection } from "mysql2/promise";
import { dateHandler, paginationHelper } from "../foundation/helper";
import { PaginationInfo } from "../type/common";

export interface PostService {
  list(
    request: PaginationRequest
  ): Promise<[PaginatedPostInfo[], PaginationInfo]>;
  show(request: ShowPostRequest): Promise<PostInfo>;
  create(userId: string, request: CreatePostRequest): Promise<PostInfo>;
  edit(userId: string, request: EditPostRequest): Promise<PostInfo>;
  delete(userId: string, request: DeletePostRequest): Promise<void>;
}

export class Post extends Service implements PostService {
  public async list(
    request: PaginationRequest
  ): Promise<[PaginatedPostInfo[], PaginationInfo]> {
    const paginatedPostInfos: PaginatedPostInfo[] = [];

    const [posts, total] = await this.repository.post.selectPaginate(
      request.page,
      request.limit,
      request.sort,
      dateHandler(request.from),
      dateHandler(request.to, true),
      request.q ? request.q : ""
    );

    for (const post of posts) {
      paginatedPostInfos.push(
        post.getPaginatedInfo(this.configuration.application.base_url)
      );
    }

    return [
      paginatedPostInfos,
      paginationHelper(total, request.page, request.limit),
    ];
  }

  public async show(request: ShowPostRequest): Promise<PostInfo> {
    const post = await this.repository.post.selectById(request.id);

    if (post === null) throw POST_NOT_FOUND;

    return post.getInfo(this.configuration.application.base_url);
  }

  public async create(
    userId: string,
    request: CreatePostRequest
  ): Promise<PostInfo> {
    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    const post = new PostModel({
      user_id: user.getId(),
      caption: request.caption,
    });

    post.setUser(user);

    const attachments: AttachmentModel[] = [];

    for (const attachment of request.attachments) {
      attachments.push(
        new AttachmentModel({
          post_id: post.getId(),
          name: attachment.name,
          original_name: attachment.original_name,
        })
      );
    }

    post.setAttachments(attachments);
    post.setComments([]);

    await this.database.transaction(
      async (tx: PoolConnection): Promise<void> => {
        await this.repository.post.insertTx(tx, post);
        await this.repository.attachment.insertBatchTx(tx, attachments);
      }
    );

    return post.getInfo(this.configuration.application.base_url);
  }

  public async edit(
    userId: string,
    request: EditPostRequest
  ): Promise<PostInfo> {
    const post = await this.getPostByIdAndUserId(userId, request.id);

    post.setCaption(request.caption);

    await this.repository.post.update(post);

    return post.getInfo(this.configuration.application.base_url);
  }

  public async delete(
    userId: string,
    request: DeletePostRequest
  ): Promise<void> {
    const post = await this.getPostByIdAndUserId(userId, request.id);

    await this.database.transaction(
      async (tx: PoolConnection): Promise<void> => {
        await this.repository.comment.deleteByPostIdTx(tx, post.getId());
        await this.repository.attachment.deleteByPostIdTx(tx, post.getId());
        await this.repository.post.deleteTx(tx, post);
      }
    );
  }

  private async getPostByIdAndUserId(
    userId: string,
    id: string
  ): Promise<PostModel> {
    console.log(id);

    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    const post = await this.repository.post.selectById(id);

    if (post === null || (post && post.getUserId() !== user.getId()))
      throw POST_NOT_FOUND;

    return post;
  }
}
