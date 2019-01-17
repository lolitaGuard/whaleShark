import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IUser from "./iUser";

export default class UserService extends BaseService {
  private static ins: UserService;
  /**
   * 获取UserService实例
   * @returns Promise<UserService>
   */
  static async getInstance(): Promise<UserService> {
    if (!UserService.ins) {
      let ins = (UserService.ins = new UserService());
      await ins.initDbs();
    }
    return UserService.ins;
  }

  private constructor() {
    super();
  }

  /**
   * 新增一个用户
   * @param  {IUser} user 用户信息
   * @returns Promise
   */
  async create(user: IUser): Promise<void> {
    await this.mongo.getCollection("user").insertOne(user);
  }

  /**
   * 获取基本信息
   * @param userId 用户编号
   * @param isRefresh 是否重新从数据库读取,默认false
   * @returns Promise<IUserInfo>
   */
  async find(userId: string, isRefresh: boolean = false): Promise<IUser> {
    let rst: IUser;
    let key = keys.user(userId);
    if (!(await this.redis.exists(key)) || isRefresh) {
      let data = await this.mongo
        .getCollection("user")
        .findOne({ _id: this.toObjectId(userId) });
      if (data) {
        data = this.renameId(data, "userId");
        await this.redis.set(key, JSON.stringify(data));
      }
    }

    rst = JSON.parse(await this.redis.get(key));
    return rst;
  }

  /**
   * 设置基本信息
   * @param userId 用户编号
   * @param userInfo 用户信息
   * @returns 是否更新成功
   */
  async setInfo(userId: string, userInfo: Partial<IUser>): Promise<void> {
    await this.mongo
      .getCollection("user")
      .updateOne({ _id: this.toObjectId(userId) }, { $set: userInfo });

    await this.refresh(userId);
  }

  /**
   * 设置约玩价格
   * @param userId 用户编号
   * @param name 价格名称,比如"约饭","约电影"
   * @param value 价格
   * @returns 是否设置成功
   */
  async setPrice(userId: string, name: string, value: number): Promise<void> {
    await this.mongo
      .getCollection("user")
      .updateOne(
        { _id: this.toObjectId(userId) },
        { $pull: { priceList: { name } } }
      );

    await this.mongo
      .getCollection("user")
      .updateOne(
        { _id: this.toObjectId(userId) },
        { $push: { priceList: { name, value } } }
      );

    await this.refresh(userId);
  }

  /**
   * 设置约玩状态
   * @param userId 用户编号
   * @param status 约玩状态
   * @returns 是否成功设置
   */
  async setInviteStatus(userId: string, status: boolean): Promise<void> {
    await this.mongo
      .getCollection("user")
      .updateOne(
        { _id: this.toObjectId(userId) },
        { $set: { inviteStatus: status } }
      );

    // clear cache
    await this.refresh(userId);
  }

  // 修改用户的coin
  async addCoin(userId: string, coin: number): Promise<void> {
    await this.mongo.getCollection("user").updateOne(
      { _id: this.toObjectId(userId) },
      {
        $inc: { coin }
      }
    );

    // clear cache
    await this.refresh(userId);
  }

  // 清理缓存
  private async refresh(userId: string) {
    let data = await this.find(userId, true);
    let key: string = keys.user(userId);
    await this.redis.set(key, JSON.stringify(data));
  }
}
