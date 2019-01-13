import assert = require("assert");
import helper from "../helper";
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";

import FavService from "../../service/favService";
import IFav from "../../service/favService/iFav";
import EFavType from "../../service/favService/eFavType";

describe("favService", async () => {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: FavService;

  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await FavService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    // this.timeout(10 * 1000);
    await helper.closeDbs();
  });

  // 收藏
  // process:
  // 收藏一条记录,其中收藏者用户名为tong
  // check:
  // 查看是否存在用户名为tong,dailyId为0001的记录
  it("收藏", async function() {
    let item: IFav = {
      dailyId: "0001",
      userId: "tong",
      logoUrl: "logoUrl",
      nickname: "zst",
      timestamp: 0,
      content: "abc",
      type: EFavType.audio,
      upvote: 1,
      favorite: 1,
      share: 1
    };
    await serviceIns.fav(item);

    let data = await mongo.getCollection("fav").findOne({
      userId: "tong",
      dailyId: "0001"
    });
    assert(!!data);
  });

  // 取消收藏
  // process:
  // 1.收藏一条记录
  // 2.取消收藏一条记录
  // check:
  // 是否已经收藏

  it("取消收藏", async function() {
    let item: IFav = {
      dailyId: "0001",
      userId: "tong",
      logoUrl: "logoUrl",
      nickname: "zst",
      timestamp: 0,
      content: "abc",
      type: EFavType.audio,
      upvote: 1,
      favorite: 1,
      share: 1
    };
    await serviceIns.fav(item);
    await serviceIns.unfav("0001");

    let data = await mongo.getCollection("fav").findOne({
      dailyId: "0001"
    });
    assert(!data);
  });

  // 是否已经收藏
  // process:
  // 增加一条dailyId为0001的记录
  // check:
  // 1.dailyId为'0001'的记录存在
  // 2.dailyId为'0002'的记录不存在
  it("是否已经收藏", async function() {
    let item: IFav = {
      dailyId: "0001",
      userId: "tong",
      logoUrl: "logoUrl",
      nickname: "zst",
      timestamp: 0,
      content: "abc",
      type: EFavType.audio,
      upvote: 1,
      favorite: 1,
      share: 1
    };
    await serviceIns.fav(item);
    assert(!!(await serviceIns.isFav("0001")));
    assert(!(await serviceIns.isFav("0002")));
  });

  // 收藏列表
  // process:
  // 增加20条记录,其中10条记录的userId是'tong'
  // check:
  // 每页5条记录,查看第0页和第1页都应该是5条记录,查看第2页为0条记录
  it("收藏列表", async function() {
    for (let i = 0; i < 20; i++) {
      let item: IFav = {
        dailyId: (10000 + i).toString().slice(1),
        userId: i % 2 ? "tong" : "jin",
        logoUrl: "logoUrl",
        nickname: "zst",
        timestamp: 0,
        content: "abc",
        type: EFavType.audio,
        upvote: 1,
        favorite: 1,
        share: 1
      };
      await serviceIns.fav(item);
    }

    assert((await serviceIns.getFavList("tong", 0, 5)).length === 5);
    assert((await serviceIns.getFavList("tong", 1, 5)).length === 5);
    assert((await serviceIns.getFavList("tong", 2, 5)).length === 0);
  });
});
