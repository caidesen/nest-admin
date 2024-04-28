import { Controller, Logger } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { serialize } from "@mikro-orm/core";
import { UserService } from "../service/user.service";
import { AuthIgnore } from "../../../common/decorator/auth-ignore.decorator";
import {
  GetUserInfoResult,
  LoginByLocalInput,
  LoginResult,
} from "../dto/auth.dto";
import { UserId } from "../../../common/decorator/user-id.decorator";
import Post = TypedRoute.Post;

@Controller("/auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @AuthIgnore()
  @Post("/loginByLocal")
  async loginByLocal(
    @TypedBody() input: LoginByLocalInput
  ): Promise<LoginResult> {
    const token = await this.userService.loginUserByLocal(input);
    return serialize(token, { exclude: ["user"] });
  }

  @Post("getMyUserInfo")
  async getMyUserInfo(@UserId() userId: string): Promise<GetUserInfoResult> {
    return this.userService.getUserInfo(userId);
  }
}
