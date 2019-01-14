import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IFollow from "./iFollow";
import EFollowStatus from "./eFollowStatus";
import Database from "../../mongo";
import { stat } from "fs";
import { formatWithOptions } from "util";

export default class FollowService extends BaseService {
  private static ins: FollowService;
  static async getInstance(): Promise<FollowService> {
    if (!FollowService.ins) {
      let ins = (FollowService.ins = new FollowService());
      await ins.initDbs();
    }
    return FollowService.ins;
  }

  private constructor() {
    super();
  }

  private async getFollowList(
    userId: string,
    statusList: EFollowStatus[],
    pageIndex: number,
    pageSize: number
  ): Promise<IFollow[]> {
    let rst: IFollow[];
    let list: IFollow[] = await this.mongo
      .getCollection("follow")
      .find({ userId, status: { $in: statusList } })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
    rst = list;
    return rst;
  }

  // 获取关注列表
  async list(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IFollow[]> {
    let rst: IFollow[];

    let key = keys.followList(userId, pageIndex);
    if (!(await this.redis.exists(key))) {
      let list: IFollow[] = await this.getFollowList(
        userId,
        [
          EFollowStatus.followEach,
          EFollowStatus.followHim,
          EFollowStatus.followMe
        ],
        pageIndex,
        pageSize
      );

      await this.redis.set(key, JSON.stringify(list));
    }

    rst = JSON.parse(await this.redis.get(key));

    return rst;
  }

  // 关注
  async follow(userId: string, followId: string): Promise<void> {
    let status: EFollowStatus = await this.getFollowStatus(userId, followId);
    let otherStatus: EFollowStatus;
    // 判断状态
    if (EFollowStatus.none === status) {
      status = EFollowStatus.followHim;
      otherStatus = EFollowStatus.followMe;
    } else if (EFollowStatus.followMe === status) {
      status = EFollowStatus.followEach;
      otherStatus = EFollowStatus.followEach;
    } else if (EFollowStatus.followHim === status) {
      return;
    } else if (EFollowStatus.followEach === status) {
      return;
    }

    // 修改自己的status
    await this.mongo
      .getCollection("follow")
      .updateOne({ userId, followId }, { $set: { status } }, { upsert: true });

    // 修改被follow方的status
    await this.mongo
      .getCollection("follow")
      .updateOne(
        { userId: followId, followId: userId },
        { $set: { status: otherStatus } },
        { upsert: true }
      );
  }

  // 取消关注
  async unfollow(userId: string, followId: string): Promise<void> {
    let status: EFollowStatus = await this.getFollowStatus(userId, followId);
    let otherStatus: EFollowStatus;

    // 判断状态
    if (EFollowStatus.none === status) {
      return;
    } else if (EFollowStatus.followMe === status) {
      return;
    } else if (EFollowStatus.followHim === status) {
      status = EFollowStatus.none;
      otherStatus = EFollowStatus.none;
    } else if (EFollowStatus.followEach === status) {
      status = EFollowStatus.followMe;
      otherStatus = EFollowStatus.followHim;
    }

    // 修改自己的status
    await this.mongo
      .getCollection("follow")
      .updateOne({ userId, followId }, { $set: { status } }, { upsert: true });

    // 修改被follow方的status
    await this.mongo
      .getCollection("follow")
      .updateOne(
        { userId: followId, followId: userId },
        { $set: { status: otherStatus } },
        { upsert: true }
      );
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

    rst =
      status === EFollowStatus.followHim || status === EFollowStatus.followEach;
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

    let follow = await this.mongo.getCollection("follow").findOne({
      userId,
      followId,
      status: { $in: [EFollowStatus.followHim, EFollowStatus.followEach] }
    });

    let otherFollow = await this.mongo.getCollection("follow").findOne({
      userId: followId,
      followId: userId,
      status: { $in: [EFollowStatus.followHim, EFollowStatus.followEach] }
    });

    if (!follow && !otherFollow) {
      return EFollowStatus.none;
    }

    if (follow && !otherFollow) {
      return EFollowStatus.followHim;
    }

    if (!follow && otherFollow) {
      return EFollowStatus.followMe;
    }
    if (follow && otherFollow) {
      return EFollowStatus.followEach;
    }

    return rst;
  }
}
