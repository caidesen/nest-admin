import { LibrariesModule } from "./libraries/libraries.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guard/auth.guard";

@Module({
  imports: [ConfigModule, LibrariesModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
