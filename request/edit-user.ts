import { object, ref, string } from "yup";

export interface EditUserRequest {
  old_password?: string | null;
  new_password?: string | null;
  new_password_confirmation?: string | null;
  avatar?: string | null;
}

class EditUser {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): EditUserRequest {
    const rules = object()
      .shape({
        old_password: string().nullable().optional(),
        new_password: string().nullable().optional(),
        new_password_confirmation: string()
          .nullable()
          .when("old_password", {
            is: (val: string | null | undefined) => !!val,
            then: (schema) =>
              schema.oneOf([ref("new_password")], "Passwords must match"),
            otherwise: (schema) => schema.notRequired(),
          })
          .optional(),
        avatar: string().nullable().optional(),
      })
      .test(
        "password-or-avatar",
        "You must provide either avatar or change password fields",
        function (value) {
          const hasAvatar = !!value.avatar;
          const hasPassword =
            !!value.old_password &&
            !!value.new_password &&
            !!value.new_password_confirmation;

          return hasAvatar || hasPassword;
        }
      );

    return rules.validateSync(this.body);
  }
}

export default EditUser;
