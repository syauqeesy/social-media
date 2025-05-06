import MySQL, { Pool, PoolConnection } from "mysql2/promise";
import { Bootable } from "./foundation";

export interface Queryable {
  withConnection<Result>(
    execute: (poolConnection: PoolConnection) => Promise<Result>
  ): Promise<Result>;
  withTransaction<Result>(
    tx: PoolConnection,
    execute: (poolConnection: PoolConnection) => Promise<Result>
  ): Promise<Result>;
}

export interface Transactionable {
  transaction(
    transactionFn: (poolConnection: PoolConnection) => Promise<void>
  ): Promise<void>;
}

class Database implements Bootable, Queryable, Transactionable {
  private host: string;
  private port: number;
  private user: string;
  private password: string;
  private database: string;

  private poolConnection!: Pool;
  private shuttingDown: boolean = false;

  public constructor({
    host,
    port,
    user,
    password,
    database,
  }: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
  }

  public async getConnection(): Promise<PoolConnection> {
    if (!this.poolConnection) throw new Error("connection pool is not started");

    return this.poolConnection.getConnection();
  }

  public async withConnection<Result>(
    execute: (connection: PoolConnection) => Promise<Result>
  ): Promise<Result> {
    if (this.shuttingDown)
      throw new Error("database is shutting down, cannot execute queries");

    const connection = await this.poolConnection.getConnection();
    try {
      return execute(connection);
    } finally {
      await connection.release();
    }
  }

  public async withTransaction<Result>(
    tx: PoolConnection,
    execute: (poolConnection: PoolConnection) => Promise<Result>
  ): Promise<Result> {
    return execute(tx);
  }

  public async transaction(
    transactionFn: (tx: PoolConnection) => Promise<void>
  ): Promise<void> {
    if (this.shuttingDown)
      throw new Error("database is shutting down, cannot execute queries");

    const connection = await this.poolConnection.getConnection();

    try {
      await connection.beginTransaction();

      await transactionFn(connection);

      await connection.commit();
    } catch (error: unknown) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.release();
    }
  }

  public async boot(): Promise<void> {
    this.poolConnection = MySQL.createPool({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: this.database,
      connectionLimit: 5,
    });
  }

  public async shutdown(): Promise<void> {
    if (!this.poolConnection) throw new Error("connection pool is not started");

    if (!this.shuttingDown) {
      this.shuttingDown = true;

      try {
        await this.poolConnection.end();
      } catch (error: unknown) {
        if (error instanceof Error) console.log(error.message);
      }
    }
  }
}

export default Database;
