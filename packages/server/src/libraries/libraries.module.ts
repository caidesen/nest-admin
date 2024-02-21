import { Global, Module } from "@nestjs/common";
import "./dayjs.import";
import { DatabaseModule } from "./database/database.module";
import { ServerLoggerModule } from "./log/logger.module";

@Global()
@Module({
  imports: [DatabaseModule, ServerLoggerModule],
  exports: [DatabaseModule, ServerLoggerModule],
})
export class LibrariesModule {}
