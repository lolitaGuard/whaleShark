import axios from "axios";
import config from "../config";
import Mongo from "../mongo";
import Redis from "../redis";
import * as protocol from "../protocol";
import { openDbs, closeDbs } from "../dbManager";
import utils from "../utils";

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

let getAxios = async (code: string) => {
  // token service
  let baseURL = utils.getDefaultPrefix();
  let axiosIns = axios.create({
    baseURL
  });
  // return axiosIns;
  let res = await axiosIns.get("/common/token/" + code);
  let data: protocol.ITokenRes = res.data.data;
  let token = data.token;
  // console.log(token);

  return axios.create({
    baseURL,
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
