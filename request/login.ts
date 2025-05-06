import { object, string } from "yup";

export interface LoginRequest {
  username: string;
  password: string;
}

class Login {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): LoginRequest {
    const rules = object().shape({
      username: string()
        .required()
        .min(3)
        .max(24)
        .matches(/^[a-z0-9]+$/),
      password: string().required().min(3).max(72),
    });

    return rules.validateSync(this.body);
  }
}

export default Login;
