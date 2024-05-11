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
import { InboundController } from "./controller/inbound.controller";
import { OutboundController } from "./controller/outbound.controller";
import { FundMovementController } from "./controller/fund-movement.controller";

@Module({
  controllers: [
    DeviceController,
    PurchaseOrderController,
    WorkOrderController,
    InboundController,
    OutboundController,
    FundMovementController,
  ],
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
