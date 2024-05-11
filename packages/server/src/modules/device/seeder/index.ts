import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { Device } from "../entity/device.entity";
import { PurchaseOrder } from "../entity/purchase-order.entity";
import { User } from "../../auth/entity/user.entity";
import dayjs from "dayjs";
import { WorkOrder } from "../entity/work-order.entity";
import _ from "lodash";
import { Inbound } from "../entity/inbound.entity";
import { FundMovement } from "../entity/fund-movement.entity";

export default class DatabaseSeeder extends Seeder {
  run(em: EntityManager): void | Promise<void> {
    const user1 = em.create(User, {
      nickname: "采购小张",
      account: {
        username: "xiaozhang",
        password: "123456",
      },
    });
    const device = [
      { name: "心电图机", code: "D0001" },
      { name: "血压计", code: "D0002" },
      { name: "超声波扫描仪", code: "D0003" },
      { name: "X射线机", code: "D0004" },
      { name: "CT扫描仪", code: "D0005" },
      { name: "MRI扫描仪", code: "D0006" },
      { name: "呼吸机", code: "D0007" },
      { name: "输液泵", code: "D0008" },
      { name: "血氧仪", code: "D0009" },
      { name: "心脏起搏器", code: "D0010" },
      { name: "人工呼吸器", code: "D0011" },
      { name: "血糖仪", code: "D0012" },
      { name: "体温计", code: "D0013" },
      { name: "缝合器", code: "D0014" },
      { name: "消毒器", code: "D0015" },
      { name: "电子胃镜", code: "D0016" },
      { name: "电子肠镜", code: "D0017" },
      { name: "血液透析机", code: "D0018" },
      { name: "骨密度仪", code: "D0019" },
      { name: "心脏监护仪", code: "D0020" },
    ].map((it) => em.create(Device, it));

    function getRandomDevice() {
      return device[Math.floor(Math.random() * device.length)];
    }

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < _.random(1, 4); j++) {
        const done = _.random() < 0.3;
        em.create(WorkOrder, {
          device: getRandomDevice(),
          faultDescription: "出现故障",
          testingDate: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
          maintainDate: done
            ? dayjs().subtract(i, "day").format("YYYY-MM-DD")
            : undefined,
          maintenanceResult: done ? "已维修" : "",
        });
      }
    }
    em.create(Inbound, {
      device: getRandomDevice(),
      date: "2024-01-08",
      agentUser: user1,
    });
    em.create(Inbound, {
      device: getRandomDevice(),
      date: "2024-01-08",
      agentUser: user1,
    });
    em.create(Inbound, {
      device: getRandomDevice(),
      date: "2024-01-08",
      agentUser: user1,
    });
    em.create(FundMovement, {
      purchaseOrder: em.create(PurchaseOrder, {
        code: "PO0001",
        device: getRandomDevice(),
        purchaseUser: user1,
        contractNumber: "C0001",
        quantity: 100,
        date: "2024-01-08",
      }),
      amount: 1000,
      date: "2024-01-08",
    });
    em.create(FundMovement, {
      purchaseOrder: em.create(PurchaseOrder, {
        code: "PO0002",
        device: getRandomDevice(),
        purchaseUser: user1,
        contractNumber: "C0002",
        quantity: 100,
        date: "2024-01-09",
      }),
      amount: 1000,
      date: "2024-01-09",
    });
    em.create(FundMovement, {
      purchaseOrder: em.create(PurchaseOrder, {
        code: "PO0003",
        device: getRandomDevice(),
        purchaseUser: user1,
        contractNumber: "C0003",
        quantity: 100,
        date: "2024-01-10",
      }),
      amount: 1000,
      date: "2024-01-10",
    });
  }
}
