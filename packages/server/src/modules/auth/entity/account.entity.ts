import { Entity, OneToOne, Property, Ref } from "@mikro-orm/core";
import { User } from "./user.entity";
import { BaseEntity } from "../../../common/entity/common-field.entity";

@Entity()
export class Account extends BaseEntity {
  @Property()
  username: string;

  @Property({ nullable: true, hidden: true })
  password: string;

  @OneToOne(() => User, (user) => user.account, {
    ref: true,
    hidden: true,
  })
  user: Ref<User>;
}
