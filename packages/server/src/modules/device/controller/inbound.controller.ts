import { Controller } from "@nestjs/common";
import { EntityManager, serialize } from "@mikro-orm/core";
import { Inbound } from "../entity/inbound.entity";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateInboundInput,
  InboundVO,
  UpdateInboundInput,
} from "../dto/inbound.dto";
import { IdsOnly } from "../../../common/dto";
import { Device } from "../entity/device.entity";
import { User } from "../../auth/entity/user.entity";
import Post = TypedRoute.Post;

@Controller("/inbound")
export class InboundController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<InboundVO[]> {
    const list = await this.em.find(
      Inbound,
      {},
      { populate: ["device", "agentUser"] }
    );
    return serialize(list, {
      populate: ["device", "agentUser"],
    });
  }

  @Post("create")
  async create(@TypedBody() input: CreateInboundInput) {
    const device = this.em.create(Inbound, {
      ...input,
      device: this.em.getReference(Device, input.device.id),
      agentUser: this.em.getReference(User, input.agentUser.id),
    });
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateInboundInput) {
    const device = await this.em.findOneOrFail(Inbound, input.id);
    this.em.assign(device, input);
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(Inbound, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
