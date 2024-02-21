import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConfigType } from "@nestjs/config";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs/typings";
import databaseConfig from "../../config/database.config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (
        config: ConfigType<typeof databaseConfig>
      ): MikroOrmModuleOptions => ({
        ...config,
        autoLoadEntities: true,
      }),
      inject: [{ token: databaseConfig.KEY, optional: true }],
    }),
  ],
})
export class DatabaseModule {}
