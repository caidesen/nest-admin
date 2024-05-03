import { tags } from "typia";
import { PageableQueryInput } from "../../../common/dto";

export interface RoleVO {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface FindRoleInput extends PageableQueryInput {
  name?: string;
}

export interface CreateRoleInput {
  name: string & tags.MaxLength<20>;
  description: string & tags.MaxLength<20>;
  permissions: string[];
}

export interface UpdateRoleInput extends CreateRoleInput {
  id: string;
}
