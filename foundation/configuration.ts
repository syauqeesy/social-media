import { config } from "dotenv";

config();

export interface Configuration {
  application: {
    env: "development" | "production";
    port: number;
    secret: string;
    base_url: string;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
}

export default {
  application: {
    env: (process.env.APPLICATION_ENV ?? "development") as
      | "development"
      | "production",
    port: Number(process.env.APPLICATION_PORT ?? 3000),
    secret: String(process.env.APPLICATION_SECRET),
    base_url: String(
      process.env.APPLICATION_BASE_URL ?? "http://localhost:3000"
    ),
  },
  database: {
    host: String(process.env.DATABASE_HOST ?? "127.0.0.1"),
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: String(process.env.DATABASE_USER ?? "root"),
    password: String(process.env.DATABASE_PASSWORD ?? ""),
    name: String(process.env.DATABASE_NAME ?? "expense_tracker"),
  },
} as Configuration;
