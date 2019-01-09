import MongoDb from "../../mongo";
import { IHandyRedis } from "handy-redis";
import db from "../../dbManager";
import * as keys from "../../redisKeys";

import IFav from "./iFav";

export default class FavService {
  private static ins: FavService;
  /**
   * 获取FavService实例
   * @returns Promise<FavService>
   */
  static async getInstance(): Promise<FavService> {
    if (!FavService.ins) {
      let ins = (FavService.ins = new FavService());
    }
    return FavService.ins;
  }

  /**
   * 获取收藏列表
   * @param userId 用户编号
   * @param pageIndex 页码
   * @param pageSize 每页个数
   * @returns 收藏列表
   */
  async getFavList(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IFav[]> {
    let rst: IFav[];

    let key = keys.followList(userId, pageIndex);
    if (!(await db.redis.exists(key))) {
      let list: IFav[] = await db.mongo
        .getCollection("fav")
        .find({ userId })
        .project({ _id: "favId" })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();
      await db.redis.set(key, JSON.stringify(list));
    }

    rst = JSON.parse(await db.redis.get(key));

    return rst;
  }

  /**
   * 收藏
   * @param favItem 收藏的信息
   * @returns 是否收藏成功
   */
  async fav(favItem: IFav): Promise<boolean> {
    let rst: boolean;

    // 是否已经收藏
    let item = await db.mongo
      .getCollection("fav")
      .findOne({ dailyId: favItem.dailyId });
    if (item) {
      return false;
    }

    await db.mongo.getCollection("fav").insertOne(favItem);

    rst = true;
    return rst;
  }

  // 取消收藏
  async unfav(dailyId: string): Promise<boolean> {
    let rst: boolean;
    // 是否已经收藏
    let item = await db.mongo.getCollection("fav").findOne({ dailyId });
    if (!item) {
      return false;
    }

    await db.mongo.getCollection("fav").deleteOne({ dailyId });

    rst = true;
    return rst;
  }
}
