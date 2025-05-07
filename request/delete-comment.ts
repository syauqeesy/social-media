import { object, string } from "yup";

export interface DeleteCommentRequest {
  id: string;
}

class DeleteComment {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): DeleteCommentRequest {
    const rules = object().shape({
      id: string().required(),
    });

    return rules.validateSync(this.body);
  }
}

export default DeleteComment;
