import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../../modules/auth/service/token.service";
import { AuthIgnoreKey } from "../decorator/auth-ignore.decorator";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      permissions: string[];
    };
  }
}

function getToken(str: string) {
  if (str?.startsWith("Bearer ")) {
    return str.slice(7);
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
    const token = getToken(request.headers.authorization as string);
    if (!token) return sendError(reply, "header Authorization not found");
    const user = await this.tokenService.validateToken(token);
    if (!user) return sendError(reply, "token invalid");
    request.user = user;
    return true;
  }
}
