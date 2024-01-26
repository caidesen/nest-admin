import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { BaseEntity } from "@/common/entity/common-field.entity";
import { Account } from "./account.entity";
import { UserGroup } from "@/modules/auth/entity/user-group.entity";

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
    cascade: [Cascade.REMOVE],
  })
  account: Ref<Account>;

  /** 关联的授权组 */
  @ManyToMany(() => UserGroup, (group) => group.users)
  userGroups = new Collection<UserGroup>(this);
}
