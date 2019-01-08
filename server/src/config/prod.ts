import IConfig from "./IConfig";

let conf: Partial<IConfig> = {
  port: 443,
  apiPrefix: "https://api.puman.xyz",

  connectStr: "mongodb://118.31.11.29:27017",
  dbName: "zst",

  // redis
  redis: {
    host: "118.31.11.29",
    port: 6379,
    pass: "sannian"
  }
};
export default conf;