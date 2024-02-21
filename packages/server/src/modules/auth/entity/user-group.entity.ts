import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity()
export class UserGroup extends BaseEntity {
  @Property()
  name: string;
  @Property()
  description: string;
  @ManyToMany(() => Role, (role) => role.userGroups, { owner: true })
  roles = new Collection<Role>(this);
  @ManyToMany(() => User, (user) => user.userGroups, { owner: true })
  users = new Collection<User>(this);
}
