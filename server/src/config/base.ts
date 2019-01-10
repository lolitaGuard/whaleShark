import IConfig from "./IConfig";
import { HOUR } from "../constant";
let conf: IConfig = {
  apiPrefix: "http://localhost",
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
  // 照片打开的临界值
  photoOpen: [0, 0, 0, 100, 300, 1000],

  // 冠军临界热度
  maxHot: 1000,

  mockToken: "sannian.zst",
  mockOpenId: "sannian.zst",

  pointRate: 1,
  coinRate: 100,

  //
  signPoint: 1,
  invitePoint: 1,
  moneyPointRate: 100,

  // 每日签到最大次数
  signCount: 1,
  // 每日转发最大次数
  inviteCount: 10,

  // 注册获得的point
  regPoint: 1,
  // 注册获得的coin
  regCoin: 0,

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
  }
};

export default conf;
