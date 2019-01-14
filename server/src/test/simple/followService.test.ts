import assert = require("assert");
import helper from "../helper";
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";

import * as keys from "../../redisKeys";
import FollowService from "../../service/followService";
import IFollow from "../../service/followService/iFollow";
import EFollowStatus from "../../service/followService/eFollowStatus";

describe("followService", async () => {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: FollowService;

  async function showData() {
    console.log(
      await mongo
        .getCollection("follow")
        .find()
        .toArray()
    );
  }

  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await FollowService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    await helper.closeDbs();
  });

  // 关注
  // process:
  // 'tong'关注了'zst'
  // check:
  // 能查到记录
  it("关注", async function() {
    await serviceIns.follow("tong", "zst");

    assert(
      !!(await mongo.getCollection("follow").findOne({
        userId: "tong",
        followId: "zst",
        status: EFollowStatus.followHim
      }))
    );
  });

  // 取消关注
  // process:
  // 1. 'tong'关注了'zst'
  // 2. 'tong'取消关注了'zst'
  // check:
  // 查不到记录
  it("取消关注", async function() {
    await serviceIns.follow("tong", "zst");
    await serviceIns.unfollow("tong", "zst");
    let data: IFollow = await mongo.getCollection("follow").findOne({
      userId: "tong",
      followId: "zst"
    });

    assert(!data || data.status === EFollowStatus.none);
  });

  // 是否关注
  // process:
  // 1. 'tong'关注了'zst'
  // 2. 'tong'关注了'sannian'
  // 3. 'sannian'关注了'tong'
  // 4. 'wy'关注了'tong'
  // check:
  // 1. 'tong'关注了'zst'
  // 2. 'tong'关注了'sannian'
  // 3. 'tong'没有关注'wy'
  it("是否关注", async function() {
    await serviceIns.follow("tong", "zst");
    await serviceIns.follow("tong", "sannian");
    await serviceIns.follow("sannian", "tong");
    await serviceIns.follow("wy", "tong");

    assert(await serviceIns.isFollow("tong", "zst"));
    assert(await serviceIns.isFollow("tong", "sannian"));
    assert(!(await serviceIns.isFollow("tong", "wy")));
  });

  // 关注状态
  // process:
  // 1. 'tong'关注了'zst'
  // 2. 'tong'关注了'sannian'
  // 3. 'sannian'关注了'tong'
  // 4. 'wy'关注了'tong'
  // check:
  // 1. 'tong'关注了'zst',followHim
  // 2. 'zst'没有关注'tong',followMe
  // 3. 'tong'和'sannian'相互关注,followEach
  // 4. 'tong'没有关注'wy',followMe
  // 5. 'tong'和'jin'的关系,followNone
  it("关注状态", async function() {
    await serviceIns.follow("tong", "zst");
    await serviceIns.follow("tong", "sannian");
    await serviceIns.follow("sannian", "tong");
    await serviceIns.follow("wy", "tong");

    assert(
      (await serviceIns.getFollowStatus("tong", "zst")) ===
        EFollowStatus.followHim
    );
    assert(
      (await serviceIns.getFollowStatus("zst", "tong")) ===
        EFollowStatus.followMe
    );
    assert(
      (await serviceIns.getFollowStatus("tong", "sannian")) ===
        EFollowStatus.followEach
    );
    assert(
      (await serviceIns.getFollowStatus("tong", "wy")) ===
        EFollowStatus.followMe
    );
    assert(
      (await serviceIns.getFollowStatus("tong", "jin")) === EFollowStatus.none
    );
  });

  // 获取关注列表
  // process:
  // 1. 'tong'关注了'zst'
  // 2. 'tong'关注了'sannian'
  // 3. 'sannian'关注了'tong'
  // 4. 'wy'关注了'tong'
  // check:
  // 1. 'tong'和'zst',followHim
  // 2. 'tong'和'sannian',followEach
  // 3. 'tong'和'wy',followMe
  // 4. 能查到列表长度为3
  it("获取关注列表", async function() {
    await serviceIns.follow("tong", "zst");
    await serviceIns.follow("tong", "sannian");
    await serviceIns.follow("sannian", "tong");
    await serviceIns.follow("wy", "tong");

    let data: IFollow[] = await serviceIns.list("tong", 0, 5);
    assert(
      data.find(fo => fo.userId === "tong" && fo.followId === "zst").status ==
        EFollowStatus.followHim
    );
    assert(
      data.find(fo => fo.userId === "tong" && fo.followId === "sannian")
        .status == EFollowStatus.followEach
    );
    assert(
      data.find(fo => fo.userId === "tong" && fo.followId === "wy").status ==
        EFollowStatus.followMe
    );
    assert(data.length === 3);
  });
});
