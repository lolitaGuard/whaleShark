import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IInvite from "./iInvite";
import EInivteAction from "./eInviteAction";
import EInviteStatus from "./eInviteStatus";

export default class InviteService extends BaseService {
  private static ins: InviteService;
  /**
   * 获取InviteService实例
   * @returns Promise<InviteService>
   */
  static async getInstance(): Promise<InviteService> {
    if (!InviteService.ins) {
      let ins = (InviteService.ins = new InviteService());
      await ins.initDbs();
    }
    return InviteService.ins;
  }

  private constructor() {
    super();
  }

  /**
   * 约玩申请
   * @param  {IInvite} 申请内容
   * @returns Promise
   */
  async apply(req: IInvite): Promise<void> {
    await this.mongo.getCollection("invite").insertOne(req);
  }

  // 约玩列表
  async list(
    userId: string,
    statusList: EInviteStatus[],
    pageIndex: number,
    pageSize: number
  ): Promise<IInvite[]> {
    let rst: IInvite[];
    let fetch = async () =>
      await this.mongo
        .getCollection("invite")
        .find({
          $or: [{ userId }, { guestId: userId }],
          status: { $in: statusList }
        })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();

    if (pageIndex === 0 && statusList.length === 1) {
      let key = keys.inviteList(userId, statusList[0], pageIndex);
      return this.cacheData(key, fetch);
    }

    rst = await fetch();
    return rst;
  }

  /**
   * 单个约玩单子详情
   * @param  {string} inviteId 约玩编号
   * @returns Promise<IInvite>
   */
  async find(inviteId: string): Promise<IInvite> {
    let rst: IInvite;

    let data = await this.mongo
      .getCollection("invite")
      .findOne({ _id: this.toObjectId(inviteId) });

    if (data) {
      data = this.renameId(data, "inviteId");
      rst = data;
    }

    return rst;
  }

  /**
   * 是否有资格处理约玩申请
   * @param  {string} inviteId 约玩编号
   * @param  {string} userId 用户编号
   * @returns Promise<boolean>
   */
  async isDeal(inviteId: string, userId: string): Promise<boolean> {
    let rst: boolean;
    rst = await this.mongo.getCollection("invite").findOne({
      guestId: userId,
      status: EInviteStatus.apply
    });
    return rst;
  }

  // 处理约玩邀请(拒绝/接受)
  async deal(inviteId: string, action: EInivteAction): Promise<void> {
    let status: EInviteStatus =
      action === EInivteAction.accept
        ? EInviteStatus.dating
        : EInviteStatus.reject;
    await this.mongo
      .getCollection("invite")
      .updateOne({ _id: this.toObjectId(inviteId) }, { $set: { status } });

    // clear cache
    let invite: IInvite = await this.find(inviteId);
    await this.clearCache(invite.userId);
  }

  /**
   * 是否有确认资格
   * @param  {string} inviteId 约玩编号
   * @param  {string} userId 用户编号
   * @returns Promise<boolean>
   */
  async isConfirm(inviteId: string, userId: string): Promise<boolean> {
    let rst: boolean;
    let invite: IInvite = await this.find(inviteId);

    // 没有对应的invite
    if (!invite) {
      return false;
    }

    // 不是当事人
    if ([invite.userId, invite.guestId].indexOf(userId) === -1) {
      return false;
    }

    // 已经confirm了
    if (invite.userId === userId && invite.userConfirm !== -1) {
      return false;
    }
    if (invite.guestId === userId && invite.guestConfirm !== -1) {
      return false;
    }

    rst = true;
    return rst;
  }

  // 约玩结果确认
  async confirm(
    inviteId: string,
    userId: string,
    confirm: 0 | 1
  ): Promise<void> {
    let status: EInviteStatus;

    let invite: IInvite = await this.find(inviteId);
    let set: any = {};
    if (invite.userId === userId) {
      set = { $set: { userConfirm: confirm } };
      invite.userConfirm = confirm;
    }
    if (invite.guestId === userId) {
      set = { $set: { guestConfirm: confirm } };
      invite.guestConfirm = confirm;
    }
    // 1 每个用户的confirm
    await this.mongo
      .getCollection("invite")
      .updateOne({ _id: this.toObjectId(inviteId) }, set);

    // 2 整个约玩的status
    let isStatus: boolean = false;
    if (invite.userConfirm === 0 || invite.guestConfirm === 0) {
      isStatus = true;
      status = EInviteStatus.fail;
    }

    if (invite.userConfirm === 1 && invite.guestConfirm === 1) {
      isStatus = true;
      status = EInviteStatus.success;
    }

    if (isStatus) {
      await this.mongo
        .getCollection("invite")
        .updateOne({ _id: this.toObjectId(inviteId) }, { $set: { status } });
    }

    this.clearCache(invite.userId);
  }

  // clear cache
  private async clearCache(userId: string): Promise<void> {
    let pattern: string = keys.inviteListOfSomeone(userId);
    await this.clearCacheBase(pattern);
  }
}
