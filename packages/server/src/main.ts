import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import { fastifyCookie } from "@fastify/cookie";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.register(fastifyCookie, {
    secret: "my-secret",
  });
  app.setGlobalPrefix("/api");
  await app.register(helmet as any);
  await app.listen(3000, "0.0.0.0");
}

bootstrap();
