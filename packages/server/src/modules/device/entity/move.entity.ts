import { BaseEntity } from "../../../common/entity/common-field.entity";
import { Entity, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { Device } from "./device.entity";
import { Department } from "./dept.entity";
import { User } from "../../auth/entity/user.entity";

@Entity()
export class Move extends BaseEntity {
  @ManyToOne(() => Device, { ref: true })
  device: Ref<Device>;
  @Property()
  date: Date;
  @ManyToOne(() => Department, { ref: true })
  sourceDept: Ref<Department>;
  @ManyToOne(() => Department, { ref: true })
  targetDept: Ref<Department>;
  @ManyToOne(() => User, { ref: true })
  agentUser: Ref<User>;
}
