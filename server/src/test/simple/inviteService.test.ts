import assert = require("assert");
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";
import * as keys from "../../redisKeys";
import helper from "../helper";

import InviteService from "../../service/inviteService";
import IInvite from "../../service/inviteService/iInvite";
import EInviteStatus from "../../service/inviteService/eInviteStatus";
import EInviteType from "../../service/inviteService/eInviteType";
import EInviteAction from "../../service/inviteService/eInviteAction";

describe("dailyService", async function() {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: InviteService;
  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await InviteService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    await helper.closeDbs();
  });

  // 创建一个约玩申请
  async function createInvite(
    userId: string,
    guestId: string
  ): Promise<string> {
    let rst: string;
    let address: string = Math.random() + "";
    let data: IInvite = {
      userId,
      logoUrl: "user.jpg",
      nickname: "user",
      userConfirm: -1,
      guestId,
      guestLogoUrl: "guest.jpg",
      guestNickname: "guest",
      guestConfirm: -1,
      status: EInviteStatus.apply,
      type: EInviteType.dinner,
      timestamp: 0,
      address,
      companion: true
    };
    await serviceIns.apply(data);

    let invite: any = await mongo.getCollection("invite").findOne({ address });
    rst = invite ? invite._id.toString() : undefined;

    return rst;
  }

  // 约玩申请
  // process:
  // 1. tong对zst发起了申请
  // check:
  // 1. 可以查询到申请记录
  it("约玩申请", async function() {
    let inviteId: string = await createInvite("tong", "zst");

    assert(inviteId && !!(await serviceIns.find(inviteId)));
  });

  // 能否处理约玩邀请
  // process:
  // 1. tong对zst发起了申请
  // 2. zst接受邀请
  // 3. tong对sannian发起了申请
  // check:
  // 1. zst可以处理申请
  // 2. zst处理过之后不能再次处理,因为不能处理多次
  // 3. tong不能处理跟sannian的申请,因为只有guest可以处理
  // 4. jin不能处理tong跟sannian的申请,因为是无关人员
  it("能否处理约玩邀请", async function() {
    let dailyId0: string = await createInvite("tong", "zst");
    let dailyId1: string = await createInvite("tong", "sannian");

    // 1
    assert(!!(await serviceIns.isDeal(dailyId0, "zst")));

    // 2
    await serviceIns.deal(dailyId0, EInviteAction.accept);
    assert(!(await serviceIns.isDeal(dailyId0, "zst")));

    // 3
    assert(!(await serviceIns.isDeal(dailyId1, "tong")));

    // 4
    assert(!(await serviceIns.isDeal(dailyId1, "jin")));
  });

  // 处理约玩邀请
  // process:
  // 1. tong对zst发起了申请
  // 2. tong对sannian发起了申请
  // 3. zst拒绝了申请
  // 4. sannian接受了申请
  // check:
  // 1. tong对zst的申请状态应该是reject
  // 2. tong对sannian的申请状态应该是dating
  it("处理约玩邀请", async function() {
    let inviteId0: string = await createInvite("tong", "zst");
    let inviteId1: string = await createInvite("tong", "sannian");

    await serviceIns.deal(inviteId0, EInviteAction.reject);
    await serviceIns.deal(inviteId1, EInviteAction.accept);
  });

  // 约玩结果确认
  // process:
  // 1. tong对zst发起了申请
  // 2. zst接受了申请
  // 3. tong确认了约玩成功
  // 4. zst确认约玩失败
  // 5. tong对sannian发起了申请
  // 6. sannian接受了申请
  // 7. tong确认了约玩成功
  // 8. sannian确认了约玩成功
  // check:
  // 1. 约玩结果应该是tong-zst的状态是fail
  // 2. 约玩结果应该是tong-sannian的状态是fail
  it("约玩结果确认", async function() {
    let dailyId0: string = await createInvite("tong", "zst");
    await serviceIns.deal(dailyId0, EInviteAction.accept);
    await serviceIns.confirm(dailyId0, "tong", 1);
    await serviceIns.confirm(dailyId0, "zst", 0);

    let invite0: IInvite = await serviceIns.find(dailyId0);
    assert(invite0.status === EInviteStatus.fail);
  });

  // 约玩列表
  // process:
  // 1. tong对zst[0-9]发起申请
  // 2. zst2接受申请
  // 3. zst4拒绝了申请
  // check:
  // 1. 可以查询在dating中的对方为zst2
  // 2. 可以查询在reject中的对方为zst4
  // 3. 可以查询apply中的长度为8
  // 4. 第0页列表会被缓存
  // 5. 第1页列表不会被缓存

  it("约玩列表", async function() {
    let ids: string[] = [];
    for (let i = 0; i < 10; i++) {
      ids[i] = await createInvite("tong", "zst" + i);
    }
    await serviceIns.deal(ids[2], EInviteAction.accept);
    await serviceIns.deal(ids[4], EInviteAction.reject);

    // check
    let inviteList: IInvite[];
    // 1
    {
      inviteList = await serviceIns.list("tong", [EInviteStatus.dating], 0, 5);
      assert(inviteList && inviteList[0].guestId === "zst2");
    }
    // 2
    {
      inviteList = await serviceIns.list("tong", [EInviteStatus.reject], 0, 5);
      assert(inviteList && inviteList[0].guestId === "zst4");
    }
    // 3
    {
      inviteList = await serviceIns.list("tong", [EInviteStatus.apply], 0, 10);
      assert(inviteList && inviteList.length === 8);
    }
    // 4
    {
      inviteList = await serviceIns.list("tong", [EInviteStatus.apply], 0, 10);
      let key: string = keys.inviteList("tong", EInviteStatus.apply, 0);
      assert(await redis.exists(key));
    }
    // 5
    {
      inviteList = await serviceIns.list("tong", [EInviteStatus.apply], 0, 10);
      let key: string = keys.inviteList("tong", EInviteStatus.apply, 1);
      assert(!(await redis.exists(key)));
    }
  });

  // 约玩列表-缓存的更新
  // process:
  // 1. tong对zst发起申请
  // 2. 查询tong的status为apply的申请
  // 3. zst接受申请
  // check:
  // 1. 查询tong的status为apply的申请,长度为0
  it("约玩列表-缓存的更新", async function() {
    let inviteId0: string = await createInvite("tong", "zst");
    await serviceIns.list("tong", [EInviteStatus.apply], 0, 5);
    await serviceIns.deal(inviteId0, EInviteAction.accept);

    let data: IInvite[] = await serviceIns.list(
      "tong",
      [EInviteStatus.apply],
      0,
      5
    );
    assert(data && data.length === 0);
  });

  // 约玩列表-guest也可以查阅到
  // process:
  // 1. tong对zst发起申请
  // check:
  // 1. 通过zst也可以查到这个申请
  it("约玩列表-guest也可以查阅到", async function() {
    await createInvite("tong", "zst");
    let data: IInvite[] = await serviceIns.list(
      "zst",
      [EInviteStatus.apply],
      0,
      5
    );
    assert(data && data.length === 1);
  });
});
