import IConfig from "./IConfig";

let conf: Partial<IConfig> = {
  host: "api.puman.xyz",
  protocol: "https",
  port: 443,

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
