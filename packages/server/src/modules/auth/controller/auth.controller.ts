import { Controller } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  GetUserInfoResult,
  LoginByLocalInput,
  LoginResult,
} from "@/modules/auth/dto/auth.dto";
import { UserService } from "@/modules/auth/service/user.service";
import { AuthIgnore } from "@/common/decorator/auth-ignore.decorator";
import { serialize } from "@mikro-orm/core";
import Post = TypedRoute.Post;
import { UserId } from "@/common/decorator/user-id.decorator";

@Controller("/auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @AuthIgnore()
  @Post("/loginByLocal")
  async loginByLocal(@TypedBody() input: LoginByLocalInput): Promise<LoginResult> {
    const token = await this.userService.loginUserByLocal(input);
    return serialize(token, { exclude: ["user"] });
  }

  @Post("getMyUserInfo")
  async getMyUserInfo(@UserId() userId: string): Promise<GetUserInfoResult> {
    return this.userService.getUserInfo(userId);
  }
}
