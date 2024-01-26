import { Injectable } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import bcrypt from "bcrypt";
import { Account } from "@/modules/auth/entity/account.entity";
import { InputException } from "@/common/exception";
import { TokenService } from "@/modules/auth/service/token.service";
import {
  GetUserInfoResult,
  LoginByLocalInput,
} from "@/modules/auth/dto/auth.dto";
import { User } from "@/modules/auth/entity/user.entity";
import { Cacheable } from "nestjs-cacheable";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService
  ) {}

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
   * todo 这里要加缓存
   * @param userId
   */
  async getUserInfo(userId: string): Promise<GetUserInfoResult> {
    const user = await this.em.findOne(
      User,
      { id: userId },
      {
        populate: ["userGroups", "userGroups.roles"],
      }
    );
    if (!user) throw new InputException("用户不存在");
    return serialize(user, { populate: ["userGroups", "userGroups.roles"] });
  }
}
