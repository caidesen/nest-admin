import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import { Device } from "../entity/device.entity";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateDeviceInput,
  DeviceVO,
  UpdateDeviceInput,
} from "../dto/device.dto";
import Post = TypedRoute.Post;
import { IdsOnly } from "../../../common/dto";

@Controller("/device")
export class DeviceController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(): Promise<DeviceVO[]> {
    return this.em.find(Device, {});
  }

  @Post("create")
  async create(@TypedBody() input: CreateDeviceInput) {
    const device = this.em.create(Device, input);
    await this.em.persistAndFlush(device);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateDeviceInput) {
    const device = await this.em.findOneOrFail(Device, input.id);
    this.em.assign(device, input);
    await this.em.flush();
  }

  @Post("delete")
  async delete(@TypedBody() input: IdsOnly) {
    for (const id of input.ids) {
      const user = this.em.getReference(Device, id);
      this.em.remove(user);
    }
    await this.em.flush();
  }
}
