import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("/api");
    return app;
  },
  output: "src/api",
  distribute: "../api",
};
export default NESTIA_CONFIG;
