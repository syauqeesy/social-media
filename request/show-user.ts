import { object, string } from "yup";

export interface ShowUserRequest {
  id: string;
}

class ShowUser {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): ShowUserRequest {
    const rules = object().shape({
      id: string().required(),
    });

    return rules.validateSync(this.body);
  }
}

export default ShowUser;
