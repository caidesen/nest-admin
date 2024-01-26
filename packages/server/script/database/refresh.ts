import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { EntityManager, MikroORM } from "@mikro-orm/core";
import { glob } from "fast-glob";
import { Seeder, SeedManager } from "@mikro-orm/seeder";
import databaseConfig from "@/config/database.config";
import { ConfigType } from "@nestjs/config";
/**
 * 加载所有播种器
 */
export async function loadSeeders() {
  const files = await glob("src/modules/**/seeder/*.ts");
  return Promise.all(files.map((file) => import(file).then((x) => x.default)));
}
export async function timedLog(p: Promise<any>, msg: string) {
  const start = Date.now();
  await p;
  const end = Date.now();
  console.debug(`${msg} - 耗时 ${end - start}ms`);
}
async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config: ConfigType<typeof databaseConfig> = app.get(databaseConfig.KEY);
  const orm = await MikroORM.init({
    ...config,
    entities: ["./src/modules/**/entity/*.entity.ts"],
    baseDir: process.cwd(),
    extensions: [SeedManager],
  });
  const schema = orm.getSchemaGenerator();
  await timedLog(schema.refreshDatabase(), "重置数据库成功");
  const seeders = await loadSeeders();
  await timedLog(
    orm.getSeeder().seed(
      class extends Seeder {
        run(em: EntityManager) {
          return this.call(em, seeders);
        }
      }
    ),
    "初始化数据成功"
  );
  await orm.close();
  await app.close();
  process.exit(0);
}
main();
