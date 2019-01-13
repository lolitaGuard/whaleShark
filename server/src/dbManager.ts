import MongoDb from "./mongo";
import RedisDb from "./redis";
import * as handyRedis from "handy-redis";

let getDbs = async () => {
  let mongo: MongoDb;
  let redis: handyRedis.IHandyRedis;

  mongo = await MongoDb.getIns();
  redis = (await RedisDb.getIns()).db;

  return { mongo, redis };
};

export default getDbs;
