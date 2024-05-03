import { RoleVO } from "./role.dto";

export interface LoginByLocalInput {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  expireAt: Date;
}

export interface GetUserInfoResult {
  id: string;
  nickname: string;
  roles: RoleVO[];
}
