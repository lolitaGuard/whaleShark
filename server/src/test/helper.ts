import Database from "../mongo";
import axios from "axios";
import config from "../config";
import RedisDb from "../redis";

let db: Database;
let redisDb: RedisDb;
let clearAll = async () => {
  await open();
  await Promise.all(
    ["user", "upvote", "list", "reward", "memory", "token", "gallery"].map(
      async n => {
        await db.getCollection(n).deleteMany({});
      }
    )
  );

  // redis
  {
    let service = (await RedisDb.getIns()).db;
    await service.flushall();
  }
};

let clearToken = async () => {
  await open();
  await db.getCollection("token").deleteMany({});
  // {
  //   let service = await RedisDb.getIns();
  //   let keys = [
  //     ...(await service.keys("token#*")),
  //     ...(await service.keys("openId#*"))
  //   ];
  //   await service.del(keys);
  // }
};

let open = async () => {
  db = await Database.getIns();
  redisDb = await RedisDb.getIns();
};

let close = async () => {
  await db.close();
  await redisDb.close();
};

let getAxios = async () => {
  // token service
  let token = "";
  return axios.create({
    baseURL: config.apiPrefix + ":" + config.port,
    headers: { token }
  });
};

// 延迟函数
// 默认延迟500ms
let delay = (ms: number = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export default {
  clearAll,
  open,
  close,

  // get axios instance
  // with token
  getAxios,

  // clean token
  clearToken,

  delay
};