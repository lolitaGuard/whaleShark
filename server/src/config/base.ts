import IConfig from "./IConfig";
import { HOUR } from "../constant";
let conf: IConfig = {
  protocol: "http",
  host: "localhost",
  port: 3000,
  // mongo
  connectStr: "mongodb://localhost:27017",
  dbName: "zst",
  // redis
  redis: {
    host: "localhost",
    port: 6379,
    pass: "sannian"
  },
  wx: {
    appId: "wxfdb0bd7037208c77",
    appSecret: "f2a1d8b4e348164bf359f14776ec8433",
    // 信息模版Id
    templateId: "rbrtfn6Qt0UYaI3G6hnBUjr6Vikoz5Q9B1Wdvk4q82E"
  },

  // token过期时间
  tokenExpires: 2 * HOUR,

  // ******** special for project ********

  mockToken: "sannian.zst",
  mockOpenId: "sannian.zst",

  // jwt
  jwt: {
    secret: "sannian",
    prefix: "Bearer "
  },

  // oss
  oss: {
    region: "oss-cn-hangzhou",
    bucket: "mucheng2020",
    accessKeyId: "LTAI7kR2B9U9tmrl",
    accessKeySecret: "esJoIvm1NWyGhmADpLzNO6YHvQpbWf",
    // 域名前缀
    prefix: "https://mucheng2020.oss-cn-hangzhou.aliyuncs.com",
    // 文件夹
    dir: "labs"
  },

  // recommend
  recommend: {
    citys: ["all", "北京", "上海", "广州"],
    pageIndexMax: 5
  }
};

export default conf;
