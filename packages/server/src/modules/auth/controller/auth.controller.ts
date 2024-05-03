import { Controller, Res } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { UserService } from "../service/user.service";
import { AuthIgnore } from "../../../common/decorator/auth-ignore.decorator";
import { GetUserInfoResult, LoginByLocalInput } from "../dto/auth.dto";
import { UserId } from "../../../common/decorator/user-id.decorator";
import { FastifyReply } from "fastify";
import "@fastify/cookie";
import Post = TypedRoute.Post;

@Controller("/auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @AuthIgnore()
  @Post("/loginByLocal")
  async loginByLocal(
    @Res({ passthrough: true }) reply: FastifyReply,
    @TypedBody() input: LoginByLocalInput
  ): Promise<void> {
    const token = await this.userService.loginUserByLocal(input);
    reply.setCookie("token", token.token, {
      path: "/",
      expires: token.expireAt,
    });
  }

  @Post("getMyUserInfo")
  async getMyUserInfo(@UserId() userId: string): Promise<GetUserInfoResult> {
    return this.userService.getUserInfo(userId);
  }
}
