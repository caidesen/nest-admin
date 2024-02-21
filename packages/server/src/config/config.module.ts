import { Global, Module } from "@nestjs/common";
import { ConfigModule as NConfigModule } from "@nestjs/config";
import redisConfig from "./redis.config";
import databaseConfig from "./database.config";

@Global()
@Module({
  imports: [
    NConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      cache: true,
      load: [databaseConfig, redisConfig],
    }),
  ],
  exports: [NConfigModule],
})
export class ConfigModule {}
