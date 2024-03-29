import {
  BaseEntity as MkBaseEntity,
  Entity,
  OptionalProps,
  PrimaryKey,
  t,
} from "@mikro-orm/core";
import {
  CreateDateProperty,
  DeleteDateProperty,
  UpdateDateProperty,
} from "mikro-orm-plus";
import { IdOnly } from "@/common/dto";

@Entity({ abstract: true })
export abstract class BaseEntity<Optional = never> extends MkBaseEntity {
  [OptionalProps]?: "createdAt" | "updatedAt" | "id" | Optional;
  @PrimaryKey({ type: t.bigint })
  id: string;

  @CreateDateProperty({})
  createdAt: Date = new Date();

  @UpdateDateProperty({})
  updatedAt: Date = new Date();

  @DeleteDateProperty({})
  deletedAt?: Date;
}

export type ConstructorVal<T, K extends keyof T> = Partial<
  Omit<T, K> & {
    [P in K]?: IdOnly;
  }
>;
