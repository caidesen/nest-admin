import { BaseEntity } from "../../../common/entity/common-field.entity";
import { Entity, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { Device } from "./device.entity";
import { User } from "../../auth/entity/user.entity";

@Entity()
export class PurchaseOrder extends BaseEntity {
  @ManyToOne(() => Device, { ref: true })
  device: Ref<Device>;
  @Property()
  date: string;
  @ManyToOne(() => User, { ref: true })
  purchaseUser: Ref<User>;
  @Property()
  quantity: number;
  /** 合同编号 */
  @Property()
  contractNumber: string;
}
