import { Module } from "@nestjs/common";
import { REDIS_CLIENT, RedisProvider } from "./redis.provider";

@Module({
  providers: [RedisProvider],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
