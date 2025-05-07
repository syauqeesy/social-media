import { object, string } from "yup";

export interface EditPostRequest {
  id: string;
  caption: string;
}

class EditPost {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): EditPostRequest {
    const rules = object().shape({
      id: string().required(),
      caption: string().required().min(3).max(255),
    });

    return rules.validateSync(this.body);
  }
}

export default EditPost;
