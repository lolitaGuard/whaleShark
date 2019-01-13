import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IFollow from "./iFollow";
import EFollowStatus from "./eFollowStatus";
import Database from "../../mongo";
import { stat } from "fs";

export default class FollowService extends BaseService {
  private static ins: FollowService;
  async getInstance(): Promise<FollowService> {
    if (!FollowService.ins) {
      FollowService.ins = new FollowService();
    }
    return FollowService.ins;
  }

  private constructor() {
    super();
  }

  // 获取关注列表
  async getFollowList(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IFollow[]> {
    let rst: IFollow[];

    let key = keys.followList(userId, pageIndex);
    if (!(await this.redis.exists(key))) {
      let list: IFollow[] = await this.mongo
        .getCollection("follow")
        .find({ userId })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();

      await this.redis.set(key, JSON.stringify(list));
    }

    rst = JSON.parse(await this.redis.get(key));

    return rst;
  }

  // 关注
  async follow(userId: string, followId: string): Promise<void> {
    let status: EFollowStatus = await this.getFollowStatus(userId, followId);

    // 判断状态
    if (EFollowStatus.none === status) {
      status = EFollowStatus.followHim;
    } else if (EFollowStatus.followMe === status) {
      status = EFollowStatus.followEach;
    } else if (EFollowStatus.followHim === status) {
      return;
    } else if (EFollowStatus.followEach === status) {
      return;
    }

    await this.mongo
      .getCollection("follow")
      .updateOne({ userId, followId }, { status }, { upsert: true });
  }

  // 取消关注
  async unfollow(userId: string, followId: string): Promise<void> {
    let status: EFollowStatus = await this.getFollowStatus(userId, followId);

    // 判断状态
    if (EFollowStatus.none === status) {
      return;
    } else if (EFollowStatus.followMe === status) {
      return;
    } else if (EFollowStatus.followHim === status) {
      status = EFollowStatus.none;
    } else if (EFollowStatus.followEach === status) {
      status = EFollowStatus.followMe;
    }

    await this.mongo
      .getCollection("follow")
      .updateOne({ userId, followId }, { status }, { upsert: true });
  }

  // 是否已经关注

  /**
   * 是否已经关注
   * @param userId 关注者
   * @param followId 被关注者
   * @returns 是否关注
   */
  async isFollow(userId: string, followId: string): Promise<boolean> {
    let rst: boolean;

    let status = await this.getFollowStatus(userId, followId);

    rst = status !== EFollowStatus.none;
    return rst;
  }

  /**
   * 关注状态
   * @param userId 关注者
   * @param followId 被关注者
   * @returns 关注状态
   */
  async getFollowStatus(
    userId: string,
    followId: string
  ): Promise<EFollowStatus> {
    let rst: EFollowStatus;

    let follow = await this.mongo
      .getCollection("follow")
      .findOne({ userId, followId });

    if (!follow) {
      return EFollowStatus.none;
    }

    rst = follow.status;

    return rst;
  }
}
