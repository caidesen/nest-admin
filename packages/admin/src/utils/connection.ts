import { functional as api, HttpError, IConnection } from "@nest-admin/api";
import { message } from "antd";

export const connection: IConnection = {
  host: location.origin + "/api",
};

type Tail<T extends any[]> = T extends [infer _First, ...infer Rest]
  ? Rest
  : never;
type DecoratedApiFunc<T> = T extends (...args: infer Args) => infer Return
  ? (...args: Tail<Args>) => Return
  : never;

export function fetchWrap<T extends (...args: any) => Promise<any>>(
  target: T
): DecoratedApiFunc<T> {
  return async function (...input: any) {
    try {
      return await target(connection, ...input);
    } catch (e) {
      if (e instanceof HttpError) {
        const msg = JSON.parse(e.message).message;
        message.error(msg);
      } else {
        message.error("请求失败");
      }
      console.error(e);
      throw e;
    }
  } as DecoratedApiFunc<T>;
}

export { api };
