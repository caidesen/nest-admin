import { registerAs } from "@nestjs/config";
import { defineConfig } from "@mikro-orm/better-sqlite";

export default registerAs("database", () =>
  defineConfig({
    dbName: process.env.DB_NAME,
  })
);
