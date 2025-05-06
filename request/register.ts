import { object, string } from "yup";

export interface RegisterRequest {
  username: string;
  password: string;
  avatar: string;
}

class Register {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): RegisterRequest {
    const rules = object().shape({
      username: string()
        .required()
        .min(3)
        .max(24)
        .matches(/^[a-z0-9]+$/),
      password: string().required().min(3).max(72),
      avatar: string().required(),
    });

    return rules.validateSync(this.body);
  }
}

export default Register;
