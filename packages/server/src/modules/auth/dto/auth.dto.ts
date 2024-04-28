import { tags } from "typia";
import { UserGroupVO } from "./user-gourp.dto";

export interface LoginByLocalInput {
  username: string & tags.MaxLength<20>;
  password: string & tags.MaxLength<20>;
}

export interface LoginResult {
  token: string;
  expireAt: Date;
}

export interface GetUserInfoResult {
  id: string;
  nickname: string;
  userGroups: UserGroupVO[];
}
