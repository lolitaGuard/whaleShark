import MongoDb from "./mongo";
import RedisDb from "./redis";
import * as handyRedis from "handy-redis";

let mongo: MongoDb;
let redis: handyRedis.IHandyRedis;

export let openDbs = async () => {
  mongo = await MongoDb.getIns();
  redis = (await RedisDb.getIns()).db;

  return { mongo, redis };
};

export let closeDbs = async () => {
  if (mongo) {
    await mongo.close();
  }
  if (redis) {
    // await redis.quit();
    await (await RedisDb.getIns()).close();
  }
};
