import { ObjectId } from "mongodb";
import Mongo from "../mongo";
import Redis from "../redis";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";

export default class BaseService {
  mongo: Mongo;
  redis: IHandyRedis;

  protected async initDbs() {
    this.mongo = await Mongo.getIns();
    this.redis = (await Redis.getIns()).db;
  }

  protected toObjectId(id: string) {
    return new ObjectId(id);
  }
}
