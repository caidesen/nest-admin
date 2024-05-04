import { Module } from "@nestjs/common";
import { DeviceController } from "./controller/device.controller";
import { DeviceService } from "./service/device.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Department } from "./entity/dept.entity";
import { Device } from "./entity/device.entity";
import { FundMovement } from "./entity/fund-movement.entity";
import { Inbound } from "./entity/inbound.entity";
import { Outbound } from "./entity/outbound.entity";
import { Move } from "./entity/move.entity";
import { PurchaseOrder } from "./entity/purchase-order.entity";
import { WorkOrder } from "./entity/work-order.entity";
import { PurchaseOrderController } from "./controller/purchase-order.controller";
import { WorkOrderController } from "./controller/work-order.controller";

@Module({
  controllers: [DeviceController, PurchaseOrderController, WorkOrderController],
  imports: [
    MikroOrmModule.forFeature([
      Department,
      Device,
      FundMovement,
      Inbound,
      Outbound,
      Move,
      PurchaseOrder,
      WorkOrder,
    ]),
  ],
  providers: [DeviceService],
})
export class DeviceModule {}
