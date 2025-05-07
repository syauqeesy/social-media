import { mixed, number, object, string } from "yup";

export interface PaginationRequest {
  page: number;
  limit: 5 | 10;
  sort: "ASC" | "DESC";
  from: string;
  to: string;
  q?: string;
}

class Pagination {
  private body: any;

  public capture(body: any): this {
    this.body = body;

    return this;
  }

  public validate(): PaginationRequest {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    const rules = object().shape({
      page: number().required().min(1),
      limit: mixed<5 | 10>().required().oneOf([5, 10]),
      sort: mixed<"ASC" | "DESC">().required().oneOf(["ASC", "DESC"]),
      from: string().required().matches(dateFormatRegex),
      to: string().required().matches(dateFormatRegex),
      q: string().optional().max(32),
    });

    return rules.validateSync(this.body);
  }
}

export default Pagination;
