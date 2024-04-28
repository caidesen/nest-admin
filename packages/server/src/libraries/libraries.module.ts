import { Global, Module } from "@nestjs/common";
import "./dayjs.import";
import { DatabaseModule } from "./database/database.module";
import { CacheableModule } from "nestjs-cacheable";
import { CacheModule } from "@nestjs/cache-manager";

@Global()
@Module({
  imports: [
    DatabaseModule,
    CacheableModule.register(),
    CacheModule.register({ isGlobal: true }),
  ],
  exports: [DatabaseModule],
})
export class LibrariesModule {}
