import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import ISign from "./iSign";

export default class SignService extends BaseService {
  private static ins: SignService;
  /**
   * 获取FavService实例
   * @returns Promise<FavService>
   */
  static async getInstance(): Promise<SignService> {
    if (!SignService.ins) {
      let ins = (SignService.ins = new SignService());
      await ins.initDbs();
    }
    return SignService.ins;
  }

  private constructor() {
    super();
  }

  // 是否已经签到
  async isSign(
    userId: string,
    year: number,
    month: number,
    date: number
  ): Promise<boolean> {
    let rst: boolean;

    let key: string = keys.sign(userId, year, month, date);

    if (!(await this.redis.exists(key))) {
      let sign = await this.mongo
        .getCollection("sign")

        .findOne({ userId, year, month, date });

      await this.redis.set(key, +!!sign + "");
      await this.redis.expireat(
        key,
        new Date(year, month - 1, date + 1).getTime()
      );
    }

    rst = !!+(await this.redis.get(key));

    return rst;
  }

  // 签到
  /**
   * @param  {string} userId 签到用户编号
   * @param  {number} year 年
   * @param  {number} month 月,从1开始算
   * @param  {number} date 日
   * @param  {number} timestamp 签到的时间戳
   * @param  {number} coin 签到获得的硬币
   * @returns Promise
   */

  async sign(
    userId: string,
    year: number,
    month: number,
    date: number,
    timestamp: number,
    coin: number
  ): Promise<void> {
    await this.mongo.getCollection("sign").insertOne({
      userId,
      year,
      month,
      date,
      timestamp,
      coin
    });

    let key: string = keys.sign(userId, year, month, date);
    await this.redis.set(key, "1");
  }
}
