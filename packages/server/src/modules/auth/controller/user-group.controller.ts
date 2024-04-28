import { Controller } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { EntityManager, serialize } from "@mikro-orm/core";
import { IdOnly, IdsOnly, PaginationResult } from "../../../common/dto";
import { UserGroup } from "../entity/user-group.entity";
import {
  defaultOrderBy,
  getPageableParams,
  queryCondBuilder,
} from "../../../common/helpers/database";
import {
  CreateUserGroupInput,
  FindUserGroupInput,
  UpdateUserGroupInput,
  UserGroupVO,
} from "../dto/user-gourp.dto";
import Post = TypedRoute.Post;

@Controller("/user-group")
export class UserGroupController {
  constructor(private readonly em: EntityManager) {}

  @Post("getUserGroupList")
  async getUserGroupList(
    @TypedBody() input: FindUserGroupInput
  ): Promise<PaginationResult<UserGroupVO>> {
    const [list, total] = await this.em.findAndCount(
      UserGroup,
      queryCondBuilder<UserGroup>().like("name", input.name).cond,
      {
        ...getPageableParams(input),
        orderBy: defaultOrderBy,
      }
    );
    return {
      list: serialize(list),
      total,
    };
  }

  @Post("createUserGroup")
  async createUserGroup(
    @TypedBody() input: CreateUserGroupInput
  ): Promise<IdOnly> {
    const userGroup = this.em.create(UserGroup, input);
    await this.em.persistAndFlush(userGroup);
    return { id: userGroup.id };
  }

  @Post("updateUserGroup")
  async updateUserGroup(@TypedBody() input: UpdateUserGroupInput) {
    const userGroup = await this.em.findOneOrFail(UserGroup, input.id);
    this.em.assign(userGroup, input);
    await this.em.flush();
  }

  @Post("deleteUserGroup")
  async deleteUserGroup(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const userGroup = this.em.getReference(UserGroup, id);
      this.em.remove(userGroup);
    }
    await this.em.flush();
  }
}
