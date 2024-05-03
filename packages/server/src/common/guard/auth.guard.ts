import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../../modules/auth/service/token.service";
import { AuthIgnoreKey } from "../decorator/auth-ignore.decorator";
import _ from "lodash";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      permissions: string[];
    };
  }
}

function sendError(reply: FastifyReply, error: string) {
  reply.code(401).send({ message: error });
  return false;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ignore = this.reflector.getAllAndOverride<boolean>(AuthIgnoreKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (ignore) return true;
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const reply = context.switchToHttp().getResponse<FastifyReply>();
    const token = _.get(request.cookies, "token");
    if (!token) return sendError(reply, "Authorization not found");
    const user = await this.tokenService.validateToken(token);
    if (!user) return sendError(reply, "token invalid");
    request.user = user;
    return true;
  }
}
