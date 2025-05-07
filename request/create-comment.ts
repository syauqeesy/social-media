import { object, string } from "yup";

export interface CreateCommentRequest {
  post_id: string;
  content: string;
}

class CreateComment {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): CreateCommentRequest {
    const rules = object().shape({
      post_id: string().required(),
      content: string().required().min(3).max(255),
    });

    return rules.validateSync(this.body);
  }
}

export default CreateComment;
