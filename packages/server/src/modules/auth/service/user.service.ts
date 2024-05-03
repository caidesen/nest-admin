import { Injectable } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import { Account } from "../entity/account.entity";
import { InputException } from "../../../common/exception";
import { GetUserInfoResult, LoginByLocalInput } from "../dto/auth.dto";
import { User } from "../entity/user.entity";
import { Cacheable } from "nestjs-cacheable";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService
  ) {}

  /**
   * 密码哈希处理
   * @param password
   */
  async passwordHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  /**
   * 校验本地账户
   */
  async validaUserByLocal(username: string, password: string) {
    const account = await this.em.findOne(Account, { username });
    if (!account) throw new InputException("帐号不存在");
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) throw new InputException("密码错误");
    await account.user.load();
    return account.user.getEntity();
  }

  /**
   * 本地账户登录
   */
  async loginUserByLocal(input: LoginByLocalInput) {
    const user = await this.validaUserByLocal(input.username, input.password);
    return await this.tokenService.createToken(user.id);
  }

  /**
   * 获取用户信息，返回结果已经被序列化
   * @param userId
   */
  @Cacheable({
    key: (userId: string) => `getUserInfo(${userId})`,
    ttl: 1000 * 60,
  })
  async getUserInfo(userId: string): Promise<GetUserInfoResult> {
    console.log("getUserInfo");
    const user = await this.em.findOne(
      User,
      { id: userId },
      {
        populate: ["roles"],
      }
    );
    if (!user) throw new InputException("用户不存在");
    return serialize(user, { populate: ["roles"] });
  }
}
