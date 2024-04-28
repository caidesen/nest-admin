import { Controller } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { EntityManager, serialize } from "@mikro-orm/core";
import _ from "lodash";
import {
  CreateRoleInput,
  FindRoleInput,
  RoleVO,
  UpdateRoleInput,
} from "../dto/role.dto";
import { IdOnly, IdsOnly, PaginationResult } from "../../../common/dto";
import { Role } from "../entity/role.entity";
import {
  defaultOrderBy,
  getPageableParams,
  queryCondBuilder,
} from "../../../common/helpers/database";
import Post = TypedRoute.Post;

@Controller("/role")
export class RoleController {
  constructor(private readonly em: EntityManager) {}

  @Post("getRoleList")
  async getRoleList(
    @TypedBody() input: FindRoleInput
  ): Promise<PaginationResult<RoleVO>> {
    const [list, total] = await this.em.findAndCount(
      Role,
      queryCondBuilder<Role>().like("name", input.name).cond,
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

  @Post("createRole")
  async createRole(@TypedBody() input: CreateRoleInput): Promise<IdOnly> {
    const role = this.em.create(Role, input);
    await this.em.persistAndFlush(role);
    return _.pick(role, ["id"]);
  }

  @Post("updateRole")
  async updateRole(@TypedBody() input: UpdateRoleInput) {
    const role = await this.em.findOneOrFail(Role, input.id);
    this.em.assign(role, input);
    await this.em.flush();
  }

  @Post("deleteRole")
  async deleteRole(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const role = this.em.getReference(Role, id);
      this.em.remove(role);
    }
    await this.em.flush();
  }
}
