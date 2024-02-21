import { Entity, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
export class Token {
  @PrimaryKey()
  token: string;
  @ManyToOne(() => User, {
    ref: true,
    hidden: true,
  })
  user: Ref<User>;
  @Property()
  expireAt: Date;
}
