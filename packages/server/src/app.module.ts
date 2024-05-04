import { LibrariesModule } from "./libraries/libraries.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guard/auth.guard";
import { DeviceModule } from "./modules/device/device.module";

@Module({
  imports: [ConfigModule, LibrariesModule, AuthModule, DeviceModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
