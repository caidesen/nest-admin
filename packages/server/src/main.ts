import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    }
  );
  app.setGlobalPrefix("/api");
  const logger = app.get(Logger);
  app.useLogger(logger);
  await app.register(helmet as any);
  await app.listen(3000, "0.0.0.0");
}

bootstrap();
