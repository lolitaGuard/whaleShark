import MongoDb from "../../mongo";
import { IHandyRedis } from "handy-redis";
import db from "../../dbManager";
import * as keys from "../../redisKeys";

import IUserInfo from "./iUserInfo";
import IPriceItem from "./iPriceItem";
import IInviteStatus from "./iInviteStatus";

export default class UserService {
  private static ins: UserService;
  /**
   * 获取UserService实例
   * @returns Promise<UserService>
   */
  static async getInstance(): Promise<UserService> {
    if (!UserService.ins) {
      let ins = (UserService.ins = new UserService());
    }
    return UserService.ins;
  }

  mongo: MongoDb;
  redis: IHandyRedis;
  private constructor() {}

  /**
   * 获取基本信息
   * @param userId
   * @returns Promise<IUserInfo>
   */
  async getUserInfo(userId: string): Promise<IUserInfo> {
    let rst: IUserInfo;
    let key = keys.user(userId);
    if (!(await db.redis.exists(key))) {
      let userInfo = (await db.mongo
        .getCollection("user")
        .findOne({ userId })) as IUserInfo;
      if (userInfo) {
        await db.redis.set(key, JSON.stringify(userInfo));
      }
    }

    rst = JSON.parse(await db.redis.get(key));
    return rst;
  }

  /**
   * 设置基本信息
   * @param userId 用户编号
   * @param userInfo 用户信息
   * @returns 是否更新成功
   */
  async setUserInfo(userId: string, userInfo: IUserInfo): Promise<boolean> {
    let rst: boolean;
    db.mongo
      .getCollection("user")
      .updateOne({ userId }, userInfo, { upsert: true });

    let key = keys.user(userId);
    db.redis.set(key, JSON.stringify(userInfo));

    rst = true;
    return rst;
  }

  /**
   * 获取约玩价格
   * @param userId 用户编号
   * @param priceName 价格名称,比如"约饭","约电影"
   * @returns 价格
   */
  async getPrice(userId: string, priceName: string): Promise<number> {
    let rst: number;
    let key: string = keys.price(userId, priceName);
    if (!(await db.redis.exists(key))) {
      let priceItem: IPriceItem = await db.mongo
        .getCollection("price")
        .findOne({ userId, priceName });
      let price: number = priceItem ? priceItem.price : -1;
      db.redis.set(key, price.toString());
    }

    rst = parseInt(await db.redis.get(key));
    return rst;
  }

  // 设置约玩价格

  /**
   * 设置约玩价格
   * @param userId 用户编号
   * @param priceName 价格名称,比如"约饭","约电影"
   * @param price 价格
   * @returns 是否设置成功
   */
  async setPrice(
    userId: string,
    priceName: string,
    price: number
  ): Promise<boolean> {
    let rst: boolean;

    db.mongo.getCollection("price").updateOne(
      { userId, priceName },
      {
        price
      },
      { upsert: true }
    );

    let key: string = keys.price(userId, priceName);
    await db.redis.set(key, price.toString());

    rst = true;
    return rst;
  }

  // 获取约玩状态

  /**
   * 获取约玩状态
   * @param userId 用户编号
   * @returns 约玩状态
   */
  async getInviteStatus(userId: string): Promise<boolean> {
    let rst: boolean;

    let key = keys.inviteStatus(userId);
    if (!(await db.redis.exists(key))) {
      let item: IInviteStatus = await db.mongo
        .getCollection("inviteStatus")
        .findOne({ userId });

      let status: boolean = item ? item.status : false;

      await db.redis.set(key, +status + "");
    }

    rst = (await db.redis.get(key)) === "true" ? true : false;

    return rst;
  }

  /**
   * 设置约玩状态
   * @param userId 用户编号
   * @param status 约玩状态
   * @returns 是否成功设置
   */
  async setInviteStatus(userId: string, status: boolean): Promise<boolean> {
    let rst: boolean;

    db.mongo
      .getCollection("inviteStatus")
      .updateOne({ userId }, { status }, { upsert: true });

    let key = keys.inviteStatus(userId);
    await db.redis.set(key, status + "");

    rst = true;
    return rst;
  }
}
