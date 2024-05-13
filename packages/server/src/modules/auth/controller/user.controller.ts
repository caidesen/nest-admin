import { Controller } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { EntityManager, serialize } from "@mikro-orm/core";
import {
  CreateUserInput,
  FindUserInput,
  UpdateUserInput,
  UserVO,
} from "../dto/user.dto";
import { IdOnly, IdsOnly, PaginationResult } from "../../../common/dto";
import { User } from "../entity/user.entity";
import {
  defaultOrderBy,
  getPageableParams,
  queryCondBuilder,
} from "../../../common/helpers/database";
import { UserService } from "../service/user.service";
import { Role } from "../entity/role.entity";
import Post = TypedRoute.Post;
import _ from "lodash";

@Controller("/user")
export class UserController {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService
  ) {}

  @Post("getUserList")
  async getUserList(
    @TypedBody() input: FindUserInput
  ): Promise<PaginationResult<UserVO>> {
    const [list, total] = await this.em.findAndCount(
      User,
      queryCondBuilder<User>().like("nickname", input.nickname).cond,
      {
        ...getPageableParams(input),
        orderBy: defaultOrderBy,
        populate: ["account", "roles"],
      }
    );
    return {
      list: serialize(list, {
        populate: ["account", "roles"],
      }),
      total,
    };
  }

  @Post("createUser")
  async createUser(@TypedBody() input: CreateUserInput): Promise<IdOnly> {
    const passwordHash = await this.userService.passwordHash(
      input.password ?? "123456"
    );
    const user = this.em.create(User, {
      nickname: input.nickname,
      account: {
        username: input.username,
        password: passwordHash,
      },
      roles: this.em.getReference(Role, input.roles?.map((it) => it.id) || []),
    });
    await this.em.persistAndFlush(user);
    return { id: user.id };
  }

  @Post("updateUser")
  async updateUser(@TypedBody() input: UpdateUserInput) {
    const user = await this.em.findOne(User, input.id, {
      populate: ["account", "roles"],
    });
    if (!user) return;
    console.log(user.account.$.id);
    this.em.assign(user, {
      nickname: input.nickname,
      roles: input.roles
        ? input.roles.map((it) => this.em.getReference(Role, it.id))
        : undefined,
    });
    if (input.username) user.account.$.username = input.username;
    if (input.password)
      user.account.$.password = await this.userService.passwordHash(
        input.password
      );
    console.log(user.account.$.id);
    await this.em.flush();
  }

  @Post("deleteUser")
  async deleteUser(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(User, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
