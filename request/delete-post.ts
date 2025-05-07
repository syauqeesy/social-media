import { object, string } from "yup";

export interface DeletePostRequest {
  id: string;
}

class DeletePost {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): DeletePostRequest {
    const rules = object().shape({
      id: string().required(),
    });

    return rules.validateSync(this.body);
  }
}

export default DeletePost;
