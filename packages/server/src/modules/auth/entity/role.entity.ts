import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";
import { User } from "./user.entity";

@Entity()
export class Role extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ type: "array" })
  permissions: string[];

  /** 关联的用户 */
  @ManyToMany(() => User, (group) => group.roles)
  users = new Collection<User>(this);
}
