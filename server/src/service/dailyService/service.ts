import { ObjectId } from "mongodb";
import db from "../../dbManager";
import * as keys from "../../redisKeys";

import IDailyCount from "./iDailyCount";
import IDailyItem from "./iDailyItem";
import IDailyUploadContent from "./iDailyUploadContent";

export default class DailyService {
  private static ins: DailyService;
  /**
   * 获取DailyService实例
   * @returns Promise<DailyService>
   */
  static async getInstance(): Promise<DailyService> {
    if (!DailyService.ins) {
      let ins = (DailyService.ins = new DailyService());
    }
    return DailyService.ins;
  }

  //

  /**
   * 颜值日记统计信息
   * @param  {string} userId 用户编号
   * @returns Promise<IDailyCount> 用户日记统计信息
   */
  async count(userId: string): Promise<IDailyCount> {
    let rst: IDailyCount;

    let key: string = keys.dailyCount(userId);
    if (!(await db.redis.exists(key))) {
      let data: IDailyCount = await db.mongo
        .getCollection("user")
        .findOne({ userId });
      await db.redis.set(key, JSON.stringify(data));
    }

    rst = JSON.parse(await db.redis.get(key));

    return rst;
  }

  // 颜值日记列表
  async list(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IDailyItem[]> {
    let rst: IDailyItem[];

    let key: string = keys.dailyList(userId, pageIndex);
    if (!(await db.redis.exists(key))) {
      let data: IDailyItem[] = await db.mongo
        .getCollection("daily")
        .find({ userId })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();
      await db.redis.set(key, JSON.stringify(data));
    }

    rst = JSON.parse(await db.redis.get(key));

    return rst;
  }

  /**
   * 上传日记
   * @param  {string} userId 用户编号
   * @param  {IDailyUploadContent} content 日记内容
   * @returns Promise
   */
  async upload(userId: string, content: IDailyUploadContent): Promise<void> {
    await db.mongo.getCollection("daily").insertOne({
      userId,
      ...content,
      upvote: 0,
      share: 0,
      favorite: 0,
      timestamp: Date.now()
    });
  }

  // 删除日记
  async remove(dailyId: string): Promise<void> {
    await db.mongo.getCollection("daily").deleteOne({
      dailyId
    });
  }

  // 增加点赞
  async upvote(dailyId: string): Promise<void> {
    await db.mongo
      .getCollection("daily")
      .updateOne({ _id: new ObjectId(dailyId) }, { $inc: { upvote: 1 } });
  }

  // 增加收藏
  async fav(dailyId: string): Promise<void> {
    await db.mongo
      .getCollection("daily")
      .updateOne({ _id: new ObjectId(dailyId) }, { $inc: { fav: 1 } });
  }

  // 增加转发
  async share(dailyId: string): Promise<void> {
    await db.mongo
      .getCollection("daily")
      .updateOne({ _id: new ObjectId(dailyId) }, { $inc: { share: 1 } });
  }
}
