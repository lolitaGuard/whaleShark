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

  protected renameId(n: any, name: string) {
    n[name] = n._id.toString();
    delete n._id;
    return n;
  }

  // 缓存key相关的数据,并且返回
  // 如果已经缓存,就立刻返回
  protected async cacheData(key: string, fetch: Function) {
    if (!(await this.redis.exists(key))) {
      let data = await fetch();
      await this.redis.set(key, JSON.stringify(data));
      return data;
    } else {
      return JSON.parse(await this.redis.get(key));
    }
  }

  // 清理缓存
  protected async clearCacheBase(pattern: string): Promise<void> {
    let keyList: string[] = await this.redis.keys(pattern);
    if (keyList && keyList.length > 0) {
      await this.redis.del(...keyList);
    }
  }
}
