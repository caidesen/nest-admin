import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "./entity/user.entity";
import { Account } from "./entity/account.entity";
import { Role } from "./entity/role.entity";
import { Token } from "./entity/token.entity";
import { TokenService } from "./service/token.service";
import { UserService } from "./service/user.service";
import { AuthController } from "./controller/auth.controller";
import { RoleController } from "./controller/role.controller";
import { UserController } from "./controller/user.controller";

@Module({
  imports: [MikroOrmModule.forFeature([User, Account, Role, Token])],
  providers: [TokenService, UserService],
  exports: [TokenService],
  controllers: [AuthController, RoleController, UserController],
})
export class AuthModule {}
