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
import { UserGroup } from "../entity/user-group.entity";
import Post = TypedRoute.Post;

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
        populate: ["account", "userGroups"],
      }
    );
    return {
      list: serialize(list, {
        populate: ["account", "userGroups"],
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
      userGroups: this.em.getReference(UserGroup, input.userGroups || []),
    });
    await this.em.persistAndFlush(user);
    return { id: user.id };
  }

  @Post("updateUser")
  async updateUser(@TypedBody() input: UpdateUserInput) {
    const user = await this.em.findOneOrFail(User, input.id);
    this.em.assign(user, {
      nickname: input.nickname,
      account: {
        username: input.username,
        password: input.password
          ? await this.userService.passwordHash(input.password)
          : undefined,
      },
      userGroups: input.userGroups
        ? this.em.getReference(UserGroup, input.userGroups || [])
        : undefined,
    });
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
