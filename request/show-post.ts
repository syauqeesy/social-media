import { object, string } from "yup";

export interface ShowPostRequest {
  id: string;
}

class ShowPost {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): ShowPostRequest {
    const rules = object().shape({
      id: string().required(),
    });

    return rules.validateSync(this.body);
  }
}

export default ShowPost;
