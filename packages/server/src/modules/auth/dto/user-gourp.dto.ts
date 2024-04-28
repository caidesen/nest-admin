import { PageableQueryInput } from "../../../common/dto";
import { RoleVO } from "./role.dto";

export interface FindUserGroupInput extends PageableQueryInput {
  name?: string;
}

export interface UserGroupVO {
  id: string;
  name: string;
  description: string;
  roles: RoleVO[];
}

export interface CreateUserGroupInput {
  name: string;
  description: string;
  roles: string[];
}

export interface UpdateUserGroupInput extends Partial<CreateUserGroupInput> {
  id: string;
}
