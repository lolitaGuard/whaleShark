import MongoDb from "./mongo";
import RedisDb from "./redis";
import * as handyRedis from "handy-redis";

let mongo: MongoDb;
let redis: handyRedis.IHandyRedis;

MongoDb.getIns().then(db => {
  mongo = db;
});

RedisDb.getIns().then(({ db }) => {
  redis = db;
});

export default { mongo, redis };
