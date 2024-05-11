import { EntityManager, ref, serialize } from "@mikro-orm/core";
import { FundMovement } from "../entity/fund-movement.entity";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateFundMovementInput,
  FundMovementVO,
  UpdateFundMovementInput,
} from "../dto/fund-movement.dto";
import { IdsOnly } from "../../../common/dto";
import Post = TypedRoute.Post;
import { PurchaseOrder } from "../entity/purchase-order.entity";
import { Controller } from "@nestjs/common";
import { BizException } from "../../../common/exception";

@Controller("/fund-movement")
export class FundMovementController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<FundMovementVO[]> {
    const list = await this.em.find(
      FundMovement,
      {},
      {
        populate: ["purchaseOrder"],
      }
    );
    return serialize(list, {
      populate: ["purchaseOrder"],
    });
  }

  @Post("create")
  async create(@TypedBody() input: CreateFundMovementInput) {
    const purchaseOrder = await this.em.findOne(PurchaseOrder, {
      code: input.purchaseOrder.code,
    });
    if (!purchaseOrder) {
      throw new BizException("采购单不存在");
    }
    const device = this.em.create(FundMovement, {
      ...input,
      purchaseOrder: purchaseOrder,
    });
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateFundMovementInput) {
    const device = await this.em.findOneOrFail(FundMovement, input.id);
    const purchaseOrder = await this.em.findOne(PurchaseOrder, {
      code: input.purchaseOrder.code,
    });
    if (!purchaseOrder) {
      throw new BizException("采购单不存在");
    }
    this.em.assign(device, {
      ...input,
      purchaseOrder,
    });
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(FundMovement, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
