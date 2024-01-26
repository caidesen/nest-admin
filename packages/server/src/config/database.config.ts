import { registerAs } from "@nestjs/config";
import { defineConfig } from "@mikro-orm/postgresql";

export default registerAs("database", () =>
  defineConfig({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    dbName: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA,
  })
);
