import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";
import { UserGroup } from "./user-group.entity";

@Entity()
export class Role extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ type: "array" })
  permissions: string[];

  /** 关联的授权组 */
  @ManyToMany(() => UserGroup, (group) => group.roles)
  userGroups = new Collection<UserGroup>(this);
}
