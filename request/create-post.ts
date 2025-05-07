import { object, string, array } from "yup";

export interface AttachmentRequest {
  name: string;
  original_name: string;
}

export interface CreatePostRequest {
  caption: string;
  attachments: AttachmentRequest[];
}

class CreatePost {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): CreatePostRequest {
    const attachmentRules = object().shape({
      name: string().required(),
      original_name: string().required(),
    });

    const rules = object().shape({
      caption: string().required().min(3).max(255),
      attachments: array().of(attachmentRules).required().min(1),
    });

    return rules.validateSync(this.body);
  }
}

export default CreatePost;
