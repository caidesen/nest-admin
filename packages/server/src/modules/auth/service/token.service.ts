import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import crypto from "node:crypto";
import { FastifyRequest } from "fastify";
import { Token } from "../entity/token.entity";
import { User } from "../entity/user.entity";

@Injectable()
export class TokenService {
  constructor(private readonly em: EntityManager) {}

  async createToken(userId: string) {
    const code = crypto.randomUUID();
    const token = this.em.create(Token, {
      token: code,
      user: this.em.getReference(User, userId),
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    await this.em.flush();
    return token;
  }

  /**
   * 通过 token 找到 user
   * @param code
   */
  async validateToken(
    code: string
  ): Promise<FastifyRequest["user"] | undefined> {
    const currentDate = new Date();
    const token = await this.em.findOne(
      Token,
      { token: code },
      { populate: ["user", "user.userGroups", "user.userGroups.roles"] }
    );
    if (!token || token.expireAt < currentDate) return;
    const arr = token.user.$.userGroups.$.map((it) =>
      it.roles.$.map((it) => it.permissions).flat()
    ).flat();
    return {
      userId: token.user.id,
      permissions: arr,
    };
  }

  /**
   * 清除过期的token
   */
  async clearExpiredTokens() {
    const currentDate = new Date();
    await this.em.nativeDelete(Token, { expireAt: { $lt: currentDate } });
  }
}
