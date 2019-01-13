import { HOUR } from "../../constant";
import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IFav from "./iFav";

export default class FavService extends BaseService {
  private static ins: FavService;
  /**
   * 获取FavService实例
   * @returns Promise<FavService>
   */
  static async getInstance(): Promise<FavService> {
    if (!FavService.ins) {
      let ins = (FavService.ins = new FavService());
      await ins.initDbs();
    }
    return FavService.ins;
  }

  private constructor() {
    super();
  }
  /**
   * 获取收藏列表
   * 只有第0页会被缓存到redis
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

    let key = keys.favList(userId, pageIndex);
    if (
      (!(await this.redis.exists(key)) && pageIndex === 0) ||
      pageIndex !== 0
    ) {
      let list: IFav[] = (await this.mongo
        .getCollection("fav")
        // .aggregate([{$project:{favId:'$_id'}}])
        .find({ userId })
        // .project({ _id: 0, upvote: 0 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray()).map(n => {
        n.favId = n._id.toString();
        delete n.id;
        return n;
      });
      if (pageIndex === 0) {
        await this.redis.set(key, JSON.stringify(list));
        await this.redis.expire(key, HOUR);
      }
      return list;
    }

    // console.log(await this.redis.keys("*"));
    rst = JSON.parse(await this.redis.get(key));

    return rst;
  }

  /**
   * 收藏
   * @param favItem 收藏的信息
   * @returns 是否收藏成功
   */
  async fav(favItem: IFav): Promise<void> {
    await this.mongo.getCollection("fav").insertOne(favItem);
  }

  // 取消收藏
  async unfav(dailyId: string): Promise<void> {
    await this.mongo.getCollection("fav").deleteOne({ dailyId });
  }

  async isFav(dailyId: string): Promise<boolean> {
    let rst: boolean;

    let item = await this.mongo.getCollection("fav").findOne({ dailyId });
    if (!item) {
      return false;
    }

    rst = true;
    return rst;
  }
}
