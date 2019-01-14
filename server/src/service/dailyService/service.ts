import { HOUR } from "../../constant";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IDailyCount from "./iDailyCount";
import IDaily from "./iDaily";

export default class DailyService extends BaseService {
  private static ins: DailyService;
  /**
   * 获取DailyService实例
   * @returns Promise<DailyService>
   */
  static async getInstance(): Promise<DailyService> {
    if (!DailyService.ins) {
      let ins = (DailyService.ins = new DailyService());
      await ins.initDbs();
    }
    return DailyService.ins;
  }

  private constructor() {
    super();
  }

  /**
   * 颜值日记统计信息
   * @param  {string} userId 用户编号
   * @returns Promise<IDailyCount> 用户日记统计信息
   */
  async count(userId: string): Promise<IDailyCount> {
    let rst: IDailyCount;

    let key: string = keys.dailyCount(userId);
    if (!(await this.redis.exists(key))) {
      let data: IDailyCount = await this.mongo
        .getCollection("user")
        .findOne({ userId });
      await this.redis.set(key, JSON.stringify(data));
    }

    rst = JSON.parse(await this.redis.get(key));

    return rst;
  }

  // 颜值日记列表
  async list(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IDaily[]> {
    let rst: IDaily[];

    let key: string = keys.dailyList(userId, pageIndex);
    if (
      (!(await this.redis.exists(key)) && pageIndex === 0) ||
      pageIndex !== 0
    ) {
      let list: IDaily[] = (await this.mongo
        .getCollection("daily")
        .find({ userId })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray()).map(n => this.renameId(n, "dailyId"));
      if (pageIndex === 0) {
        await this.redis.set(key, JSON.stringify(list));
        await this.redis.expire(key, HOUR);
      }
      return list;
    }

    rst = JSON.parse(await this.redis.get(key));

    return rst;
  }

  /**
   * 上传日记
   * @param  {string} userId 用户编号
   * @param  {IDailyUploadContent} content 日记内容
   * @returns Promise
   */
  async upload(daily: IDaily): Promise<void> {
    await this.mongo.getCollection("daily").insertOne(daily);
  }

  // 删除日记
  async remove(dailyId: string): Promise<void> {
    await this.mongo.getCollection("daily").deleteOne({
      _id: this.toObjectId(dailyId)
    });
  }

  // 增加点赞
  async upvote(dailyId: string): Promise<void> {
    await this.mongo
      .getCollection("daily")
      .updateOne({ _id: this.toObjectId(dailyId) }, { $inc: { upvote: 1 } });
  }

  // 增加收藏
  async fav(dailyId: string): Promise<void> {
    await this.mongo
      .getCollection("daily")
      .updateOne({ _id: this.toObjectId(dailyId) }, { $inc: { fav: 1 } });
  }

  // 取消收藏
  async unfav(dailyId: string): Promise<void> {
    await this.mongo
      .getCollection("daily")
      .updateOne({ _id: this.toObjectId(dailyId) }, { $inc: { fav: -1 } });
  }

  // 增加转发
  async share(dailyId: string): Promise<void> {
    await this.mongo
      .getCollection("daily")
      .updateOne({ _id: this.toObjectId(dailyId) }, { $inc: { share: 1 } });
  }

  // 查找一个日记的详情
  async find(dailyId: string): Promise<IDaily> {
    let rst: IDaily;
    let data = await this.mongo
      .getCollection("daily")
      .findOne({ _id: this.toObjectId(dailyId) });
    if (data) {
      data.dailyId = data._id.toString();
      delete data._id;
      rst = data;
    }
    return rst;
  }
}
