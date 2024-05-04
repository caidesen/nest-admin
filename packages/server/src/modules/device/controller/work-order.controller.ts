import { Controller } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import { WorkOrder } from "../entity/work-order.entity";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateWorkOrderInput,
  UpdateWorkOrderInput,
  WorkOrderVO,
} from "../dto/work-order.dto";
import { IdsOnly } from "../../../common/dto";
import { Device } from "../entity/device.entity";
import Post = TypedRoute.Post;

@Controller("/work-order")
export class WorkOrderController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<WorkOrderVO[]> {
    const list = await this.em.find(WorkOrder, {}, { populate: ["device"] });
    return serialize(list, {
      populate: ["device"],
    });
  }

  @Post("create")
  async create(@TypedBody() input: CreateWorkOrderInput) {
    const device = this.em.create(WorkOrder, {
      ...input,
      device: this.em.getReference(Device, input.device.id),
    });
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateWorkOrderInput) {
    const device = await this.em.findOneOrFail(WorkOrder, input.id);
    this.em.assign(device, input);
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(WorkOrder, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
