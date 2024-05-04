import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";

@Entity()
export class Device extends BaseEntity {
  @Property()
  code: string;
  @Property()
  name: string;
}
