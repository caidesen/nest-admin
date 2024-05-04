import { Controller } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import { TypedBody, TypedRoute } from "@nestia/core";
import { IdsOnly } from "../../../common/dto";
import {
  CreatePurchaseOrderInput,
  PurchaseOrderVO,
  UpdatePurchaseOrderInput,
} from "../dto/purchase-order.dto";
import { PurchaseOrder } from "../entity/purchase-order.entity";
import { Device } from "../entity/device.entity";
import { User } from "../../auth/entity/user.entity";
import _ from "lodash";
import Post = TypedRoute.Post;

@Controller("/purchase")
export class PurchaseOrderController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<PurchaseOrderVO[]> {
    const list = await this.em.find(
      PurchaseOrder,
      {},
      {
        populate: ["purchaseUser", "device"],
      }
    );
    return serialize(list, {
      populate: ["purchaseUser", "device"],
    });
  }

  @Post("create")
  async create(@TypedBody() input: CreatePurchaseOrderInput) {
    const device = this.em.create(PurchaseOrder, {
      ..._.pick(input, ["date", "quantity", "contractNumber"]),
      device: this.em.getReference(Device, input.device.id),
      purchaseUser: this.em.getReference(User, input.purchaseUser.id),
    });
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdatePurchaseOrderInput) {
    const device = await this.em.findOneOrFail(PurchaseOrder, input.id);
    this.em.assign(device, input);
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(PurchaseOrder, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
