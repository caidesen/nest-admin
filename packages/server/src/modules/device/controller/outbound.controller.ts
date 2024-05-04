import { Controller } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import { Outbound } from "../entity/outbound.entity";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateOutboundInput,
  OutboundVO,
  UpdateOutboundInput,
} from "../dto/outbound.dto";
import { IdsOnly } from "../../../common/dto";
import { Device } from "../entity/device.entity";
import { User } from "../../auth/entity/user.entity";
import Post = TypedRoute.Post;

@Controller("/outbound")
export class OutboundController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<OutboundVO[]> {
    const list = await this.em.find(
      Outbound,
      {},
      { populate: ["device", "agentUser"] }
    );
    return serialize(list, {
      populate: ["device", "agentUser"],
    });
  }

  @Post("create")
  async create(@TypedBody() input: CreateOutboundInput) {
    const device = this.em.create(Outbound, {
      ...input,
      device: this.em.getReference(Device, input.device.id),
      agentUser: this.em.getReference(User, input.agentUser.id),
    });
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateOutboundInput) {
    const device = await this.em.findOneOrFail(Outbound, input.id);
    this.em.assign(device, input);
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(Outbound, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
