import { Entity } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/entity/common-field.entity";

@Entity()
export class Department extends BaseEntity {
  name: string;
}
