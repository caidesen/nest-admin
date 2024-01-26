import { Global, Module } from "@nestjs/common";
import { ConfigModule as NConfigModule } from "@nestjs/config";
import databaseConfig from "@/config/database.config";
import redisConfig from "@/config/redis.config";

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
