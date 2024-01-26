import { Global, Module } from "@nestjs/common";
import "./dayjs.import";
import { RedisModule } from "@/libraries/redis/redis.module";
import { DatabaseModule } from "@/libraries/database/database.module";
import { ServerLoggerModule } from "@/libraries/log/logger.module";

@Global()
@Module({
  imports: [RedisModule, DatabaseModule, ServerLoggerModule],
  exports: [RedisModule, DatabaseModule, ServerLoggerModule],
})
export class LibrariesModule {}
