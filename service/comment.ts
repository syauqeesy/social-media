import { CreateCommentRequest } from "../request/create-comment";
import { DeleteCommentRequest } from "../request/delete-comment";
import { CommentInfo } from "../type/comment";
import CommentModel from "../model/comment";
import Service from "./service";
import { USER_NOT_FOUND } from "../exception/user";
import { POST_NOT_FOUND } from "../exception/post";
import { COMMENT_NOT_FOUND } from "../exception/comment";

export interface CommentService {
  create(userId: string, request: CreateCommentRequest): Promise<CommentInfo>;
  delete(userId: string, request: DeleteCommentRequest): Promise<void>;
}

export class Comment extends Service implements CommentService {
  public async create(
    userId: string,
    request: CreateCommentRequest
  ): Promise<CommentInfo> {
    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    const post = await this.repository.post.selectById(request.post_id);

    if (post === null) throw POST_NOT_FOUND;

    const comment = new CommentModel({
      post_id: post.getId(),
      user_id: user.getId(),
      content: request.content,
    });

    comment.setUser(user);

    await this.repository.comment.insert(comment);

    return comment.getInfo(this.configuration.application.base_url);
  }

  public async delete(
    userId: string,
    request: DeleteCommentRequest
  ): Promise<void> {
    const user = await this.repository.user.selectById(userId);

    if (user === null) throw USER_NOT_FOUND;

    const comment = await this.repository.comment.selectById(request.id);

    if (comment === null || (comment && comment.getUserId() !== user.getId()))
      throw COMMENT_NOT_FOUND;

    await this.repository.comment.delete(comment);
  }
}
