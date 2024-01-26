import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Ref,
} from "@mikro-orm/core";
import { User } from "@/modules/auth/entity/user.entity";

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
