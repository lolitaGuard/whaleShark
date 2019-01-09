import MongoDb from "./mongo";
import RedisDb from "./redis";
import * as handyRedis from "handy-redis";

let mongo: MongoDb;
let redis: handyRedis.IHandyRedis;
interface IDbCollection {
  mongo: MongoDb;
  redis: handyRedis.IHandyRedis;
}

async function getIns(): Promise<IDbCollection> {
  mongo = mongo || (await MongoDb.getIns());
  redis = redis || (await RedisDb.getIns()).db;
  return {
    mongo,
    redis
  };
}

export default getIns;
