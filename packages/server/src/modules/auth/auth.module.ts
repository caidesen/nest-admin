import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "@/modules/auth/entity/user.entity";
import { Account } from "@/modules/auth/entity/account.entity";
import { Role } from "@/modules/auth/entity/role.entity";
import { TokenService } from "@/modules/auth/service/token.service";
import { UserService } from "@/modules/auth/service/user.service";
import { AuthController } from "@/modules/auth/controller/auth.controller";
import { Token } from "@/modules/auth/entity/token.entity";
import { UserGroup } from "@/modules/auth/entity/user-group.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User, Account, Role, Token, UserGroup])],
  providers: [TokenService, UserService],
  exports: [TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
