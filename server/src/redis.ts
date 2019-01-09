import * as redis from "handy-redis";
import { EventEmitter } from "events";
import config from "./config";
import utils from "./utils";

// 数据库状态
enum eStatus {
  open,
  close
}
let { port, host, pass } = config.redis;
class RedisDb extends EventEmitter {
  db: redis.IHandyRedis;
  status: eStatus;

  private static ins: RedisDb;

  static async getIns(): Promise<RedisDb> {
    let ins = (RedisDb.ins = RedisDb.ins || new RedisDb());
    if (ins.status === eStatus.close) {
      ins.connect();
    }
    return ins;
  }

  private constructor() {
    super();
    this.connect();
  }

  connect() {
    this.db = redis.createHandyClient(config.redis.port, config.redis.host, {
      password: config.redis.pass
    });
    this.status = eStatus.open;
  }

  close(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // this.db.end(true);
      // this.db.on("end", () => {
      //   console.log("redis client close");
      //   resolve(true);
      // });
      this.db.quit();
      this.status = eStatus.close;
      resolve(true);
    });
  }
}

export default RedisDb;
