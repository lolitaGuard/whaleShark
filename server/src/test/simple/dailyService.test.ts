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

  // 上传一个日记,并且返回其dailyId
  async function uploadOneDaily(userId: string): Promise<string> {
    let rst: string;
    let content: IDaily = {
      userId,
      logoUrl: "logo.jpg",
      nickname: "puman",
      timestamp: 0,
      content: "hello world",
      upvote: 0,
      fav: 0,
      share: 0,
      type: EDailyUrlType.audio,
      urlList: ["url0"]
    };
    await serviceIns.upload(content);

    let data = await mongo.getCollection("daily").findOne({
      userId: "tong"
    });
    let dailyId: string = data._id.toString();

    rst = dailyId;
    return rst;
  }

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
  // 2. 日记的userId是tong
  it("上传日记", async function() {
    let dailyId: string = await uploadOneDaily("tong");

    let daily: IDaily = await serviceIns.find(dailyId);
    assert(!!daily && daily.userId === "tong");
  });

  // 删除日记
  // process:
  // 1. tong上传一篇日记
  // 2. tong删除日记
  // check:
  // 1. tong的日记不存在
  it("删除日记", async function() {
    let dailyId = await uploadOneDaily("tong");
    await serviceIns.remove(dailyId);

    assert(
      !(await mongo.getCollection("daily").findOne({
        userId: "tong"
      }))
    );
  });

  // 收藏日记
  // process:
  // 1. tong上传一篇日记
  // 2. jin收藏日记
  // check:
  // 1. tong的日记的fav+1
  it("收藏日记", async function() {
    let dailyId = await uploadOneDaily("tong");
    await serviceIns.fav(dailyId);

    let daily: IDaily = await serviceIns.find(dailyId);
    assert(daily.fav === 1);
  });

  // 取消收藏日记
  // process:
  // 1. tong上传一篇日记
  // 2. jin收藏日记
  // 3. jin取消收藏日记
  // check:
  // 1. tong的日记的fav为0
  it("取消收藏日记", async function() {
    let dailyId = await uploadOneDaily("tong");
    await serviceIns.fav(dailyId);
    await serviceIns.unfav(dailyId);

    let daily: IDaily = await serviceIns.find(dailyId);
    assert(daily.fav === 0);
  });

  // 给日记点赞
  // process:
  // 1. tong上传一篇日记
  // 2. jin点赞日记
  // check:
  // 1. tong的日记的upvote为1
  it("给日记点赞", async function() {
    let dailyId = await uploadOneDaily("tong");
    await serviceIns.upvote(dailyId);

    let daily: IDaily = await serviceIns.find(dailyId);
    assert(daily.upvote === 1);
  });

  // 分享日记
  // process:
  // 1. tong上传一篇日记
  // 2. jin分享日记
  // check:
  // 1. tong的日记的share为1
  it("分享日记", async function() {
    let dailyId = await uploadOneDaily("tong");
    await serviceIns.share(dailyId);

    let daily: IDaily = await serviceIns.find(dailyId);
    assert(daily.share === 1);
  });

  // 获取日记列表
  // process:
  // 1. 增加10个日记
  // check:
  // 1. 每页5条记录,查看第0页和第1页都应该是5条记录,查看第2页为0条记录
  // 2. 第0页会被缓存,其他页不会
  it("获取日记列表", async function() {
    for (let i = 0; i < 10; i++) {
      await uploadOneDaily("tong");
    }

    // 1
    assert((await serviceIns.list("tong", 0, 5)).length === 5);
    assert((await serviceIns.list("tong", 1, 5)).length === 5);
    assert((await serviceIns.list("tong", 2, 5)).length === 0);

    // 2
    assert(!!(await redis.exists(keys.dailyList("tong", 0))));
    assert(!(await redis.exists(keys.dailyList("tong", 1))));
  });

  // 总计
  // process:
  // 1. tong增加2个日记
  // 2. jin点赞了tong的第0个日记,收藏了tong的第1个日记,分享了tong的第0个日记
  // 3. jin点赞了tong的第1个日记,收藏了tong的第1个日记
  // 4. jin取消收藏了tong的第0个日记
  // check:
  // 1. tong的日记总计是2个点赞,1个收藏,1个分享

  // it("总计", async function() {
  //   let dailyId0: string = await uploadOneDaily("tong");
  //   let dailyId1: string = await uploadOneDaily("tong");
  //   await serviceIns.upvote(dailyId0);
  //   await serviceIns.fav(dailyId0);
  //   await serviceIns.share(dailyId0);
  //   await serviceIns.upvote(dailyId1);
  //   await serviceIns.fav(dailyId1);
  //   await serviceIns.unfav(dailyId0);

  //   let report = await serviceIns.count("tong");
  //   assert(report.upvote === 2 && report.fav === 1 && report.share === 1);
  // });
});
