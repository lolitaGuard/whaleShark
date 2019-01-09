import MongoDb from "../../mongo";
import { IHandyRedis } from "handy-redis";
import db from "../../dbManager";
import * as keys from "../../redisKeys";

import ISign from "./iSign";

export default class SignService {
  private static ins: SignService;
  /**
   * 获取FavService实例
   * @returns Promise<FavService>
   */
  static async getInstance(): Promise<SignService> {
    if (!SignService.ins) {
      let ins = (SignService.ins = new SignService());
    }
    return SignService.ins;
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

    if (!(await db.redis.exists(key))) {
      let sign = await db.mongo
        .getCollection("sign")

        .findOne({ userId, year, month, date });

      await db.redis.set(key, +!!sign + "");
      await db.redis.expireat(
        key,
        new Date(year, month - 1, date + 1).getTime()
      );
    }

    rst = !!+(await db.redis.get(key));

    return rst;
  }

  // 签到
  async sign(
    userId: string,
    year: number,
    month: number,
    date: number,
    timestamp: number,
    coin: number
  ): Promise<void> {
    await db.mongo.getCollection("sign").insertOne({
      userId,
      year,
      month,
      date,
      timestamp,
      coin
    });

    let key: string = keys.sign(userId, year, month, date);
    await db.redis.set(key, "1");
  }
}
