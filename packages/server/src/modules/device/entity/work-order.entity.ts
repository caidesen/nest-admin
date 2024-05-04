import { Entity, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { Device } from "./device.entity";
import { BaseEntity } from "../../../common/entity/common-field.entity";

@Entity()
export class WorkOrder extends BaseEntity {
  @ManyToOne(() => Device, { ref: true })
  device: Ref<Device>;
  @Property({ nullable: true })
  testingDate?: string;
  @Property()
  faultDescription: string;
  @Property({ nullable: true })
  maintainDate?: string;
  @Property()
  maintenanceResult: string;
}
