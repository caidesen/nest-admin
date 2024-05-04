import { BaseEntity } from "../../../common/entity/common-field.entity";
import { Entity, OneToOne, Property, Ref } from "@mikro-orm/core";
import { PurchaseOrder } from "./purchase-order.entity";

@Entity()
export class FundMovement extends BaseEntity {
  @Property()
  date: string;
  @Property()
  amount: number;
  @OneToOne(() => PurchaseOrder, { ref: true })
  purchaseOrder: Ref<PurchaseOrder>;
}
