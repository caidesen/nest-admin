import { PageableQueryInput } from "../../../common/dto";
import { RoleVO } from "./role.dto";
import { tags } from "typia";

export interface UserVO {
  id: string;
  nickname: string;
  account?: {
    username: string;
  };
  roles?: RoleVO[];
}
export interface SimpleUserVO {
  id: string;
  nickname: string;
}

export interface FindUserInput extends PageableQueryInput {
  nickname?: string;
}

export interface CreateUserInput {
  nickname: string & tags.MaxLength<20>;
  username: string & tags.MaxLength<20>;
  password?: string & tags.MaxLength<20>;
  roles?: { id: string }[];
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}
