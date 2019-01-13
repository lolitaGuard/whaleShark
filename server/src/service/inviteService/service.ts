import { ObjectId } from "mongodb";
import BaseService from "../baseService";
import * as keys from "../../redisKeys";

import IInviteApply from "./iInviteApply";
import IInviteItem from "./iInviteItem";
import IInviteDetail from "./iInviteDetail";
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
   * @param  {IInviteApply} 申请内容
   * @returns Promise
   */
  async apply(req: IInviteApply): Promise<void> {
    await this.mongo.getCollection("invite").insertOne(req);
  }

  //     约玩列表
  async list(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IInviteItem[]> {
    let rst: IInviteItem[];

    let data: IInviteItem[] = await this.mongo
      .getCollection("invite")
      .find({ userId })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();

    rst = data;
    return rst;
  }

  //     单个约玩单子详情
  async detail(inviteId: string): Promise<IInviteDetail> {
    let rst: IInviteDetail;

    let data = await this.mongo
      .getCollection("invite")
      .findOne({ _id: new ObjectId(inviteId) });

    rst = data;
    return rst;
  }

  //     处理约玩邀请(拒绝/接受)
  async deal(inviteId: string, action: EInivteAction): Promise<void> {
    await this.mongo
      .getCollection("invite")
      .updateOne({ _id: new ObjectId(inviteId) }, { action });
  }

  // 约玩结果确认
  async confirm(inviteId: string, status: EInviteStatus): Promise<void> {
    await this.mongo
      .getCollection("invite")
      .updateOne({ _id: new ObjectId(inviteId) }, { status });
  }
}
