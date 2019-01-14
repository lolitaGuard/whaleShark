import assert = require("assert");
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";
import * as keys from "../../redisKeys";
import helper from "../helper";

import DailyService from "../../service/dailyService";
import IDaily from "../../service/dailyService/iDaily";
import EDailyUrlType from "../../service/dailyService/eDailyUrlType";

describe("dailyService", async function() {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: DailyService;

  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await DailyService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    await helper.closeDbs();
  });

  // 上传日记
  // process:
  // 1. tong上传一篇日记
  // check:
  // 1. 可以被搜索到记录
  it("上传日记", async function() {
    let content: IDaily = {
      userId: "tong",
      logoUrl: "logo.jpg",
      nickname: "puman",
      timestamp: 0,
      content: "hello world",
      upvote: 0,
      favorite: 0,
      share: 0,
      type: EDailyUrlType.audio,
      urlList: ["url0"]
    };
    await serviceIns.upload(content);

    assert(!!(await mongo.getCollection("daily").findOne({ userId: "tong" })));
  });

  // 删除日记
  // process:
  // 1. tong上传一篇日记
  // 2. tong删除日记
  // check:
  // 1. tong的日记不存在
  it("删除日记", async function() {
    let content: IDaily = {
      userId: "tong",
      logoUrl: "logo.jpg",
      nickname: "puman",
      timestamp: 0,
      content: "hello world",
      upvote: 0,
      favorite: 0,
      share: 0,
      type: EDailyUrlType.audio,
      urlList: ["url0"]
    };
    await serviceIns.upload(content);

    let data = await mongo.getCollection("daily").findOne({ userId: "tong" });
    let dailyId: string = data._id.toString();
    await serviceIns.remove(dailyId);

    assert(!(await mongo.getCollection("daily").findOne({ userId: "tong" })));
  });

  // 获取日记列表
  // process:
  // check:

  // 收藏日记
  // process:
  // check:

  // 取消收藏日记

  // 给日记点赞
  // process:
  // check:

  // 分享日记
  // process:
  // check:
});
