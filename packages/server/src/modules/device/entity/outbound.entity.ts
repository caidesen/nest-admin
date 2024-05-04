import { Entity, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";
import { User } from "../../auth/entity/user.entity";
import { Device } from "./device.entity";

@Entity()
export class Outbound extends BaseEntity {
  @ManyToOne(() => Device, { ref: true })
  device: Ref<Device>;
  @ManyToOne(() => User, { ref: true })
  agentUser: Ref<User>;
  @Property()
  date: string;
}
