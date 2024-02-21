import { tags } from "typia";
import { RoleVO } from "./role.dto";

export interface LoginByLocalInput {
  username: string & tags.MaxLength<20>;
  password: string & tags.MaxLength<20>;
}

export interface LoginResult {
  token: string;
  expireAt: Date;
}

export interface UserGroupVO {
  id: string;
  name: string;
  description: string;
  roles: RoleVO[];
}

export interface GetUserInfoResult {
  id: string;
  nickname: string;
  userGroups: UserGroupVO[];
}
