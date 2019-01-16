import axios from "axios";
import config from "../config";
import Mongo from "../mongo";
import Redis from "../redis";
import { openDbs, closeDbs } from "../dbManager";

let clearAll = async () => {
  let { mongo, redis } = await openDbs();
  // mongo
  {
    let colltions = ["daily", "fav", "follow", "invite", "sign", "user"];
    await Promise.all(
      colltions.map(async n => {
        return mongo.getCollection(n).deleteMany({});
      })
    );
  }
  // redis
  {
    await redis.flushall();
  }
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
  closeDbs,

  // get axios instance
  // with token
  getAxios,

  delay,
  openDbs
};
