import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { Account } from "./account.entity";
import { BaseEntity } from "../../../common/entity/common-field.entity";
import { Role } from "./role.entity";

@Entity()
export class User extends BaseEntity {
  /** 昵称 */
  @Property()
  nickname: string;

  /** 关联账户 */
  @OneToOne(() => Account, (account) => account.user, {
    ref: true,
    hidden: true,
    owner: true,
  })
  account: Ref<Account>;

  /** 关联的角色 */
  @ManyToMany(() => Role, (role) => role.users, { owner: true })
  roles = new Collection<Role>(this);
}
