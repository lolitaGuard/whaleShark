import MongoDb from "../../mongo";
import { IHandyRedis } from "handy-redis";
import db from "../../dbManager";
import * as keys from "../../redisKeys";

import IRecommendFilter from "./iRecommendFilter";
import IRecommendUser from "./iRecommendUser";
import { DBRef } from "bson";
import { FilterQuery } from "mongodb";
import { json } from "body-parser";

export default class RecommendService {
  private static ins: RecommendService;
  /**
   * 获取RecommendService实例
   * @returns Promise<RecommendService>
   */
  static async getInstance(): Promise<RecommendService> {
    if (!RecommendService.ins) {
      let ins = (RecommendService.ins = new RecommendService());
    }
    return RecommendService.ins;
  }

  /**
   * 获取推荐列表
   * @param filter 过滤器
   * @param pageIndex 页码
   * @param pageSize 每页个数
   * @returns recommend list
   */
  async getRecommendList(
    filter: IRecommendFilter,
    pageIndex: number,
    pageSize: number
  ): Promise<IRecommendUser[]> {
    let rst: IRecommendUser[];

    let { city, isInvite } = filter;
    let key: string = keys.recommendList(city || "all", pageIndex);

    let query: any = {};
    if (city) {
      query.city = city;
    }
    if (isInvite) {
      query.status = true;
    }

    if (!(await db.redis.exists(key))) {
      let data = await db.mongo
        .getCollection("user")
        .find(query)
        .skip(pageIndex * pageSize)
        .limit(pageSize);

      await db.redis.set(key, JSON.stringify(data));
    }

    rst = JSON.parse(await db.redis.get(key));
    return rst;
  }
}
