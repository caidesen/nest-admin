import { tags } from "typia";
import { PageableQueryInput } from "../../../common/dto";
import { UserGroupVO } from "./user-gourp.dto";

export interface AccountVO {
  username: string;
  password: string;
}

export interface UserVO {
  id: string;
  nickname: string;
  // account: AccountVO;
  userGroups: UserGroupVO[];
}

export interface FindUserInput extends PageableQueryInput {
  nickname?: string;
  userGroup?: string;
}

export interface CreateUserInput {
  nickname: string & tags.MaxLength<20>;
  username: string & tags.MaxLength<20>;
  password?: string & tags.MaxLength<20>;
  userGroups?: string[];
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}
