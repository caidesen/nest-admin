import { Seeder } from "@mikro-orm/seeder";
import Bcrypt from "bcrypt";
import { Dictionary, EntityManager } from "@mikro-orm/core";
import { User } from "../entity/user.entity";
import { Role } from "../entity/role.entity";

class UserSeeder extends Seeder {
  async run(em: EntityManager, ctx: Dictionary) {
    ctx.adminUser = em.create(User, {
      nickname: "admin",
      account: {
        username: "admin",
        password: await Bcrypt.hash("admin", 8),
      },
    });
  }
}

class RoleSeeder extends Seeder {
  run(em: EntityManager, ctx: Dictionary) {
    em.create(Role, {
      name: "系统管理员",
      description: "系统管理员",
      permissions: ["*"],
      users: [ctx.adminUser],
    });
  }
}

export default class DatabaseSeeder extends Seeder {
  run(em: EntityManager): void | Promise<void> {
    return this.call(em, [UserSeeder, RoleSeeder]);
  }
}
