import assert = require("assert");
import helper from "../helper";
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";

import SignService from "../../service/signService";

describe("signService", async () => {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: SignService;

  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await SignService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    console.log("sign test - after");
    await helper.closeDbs();
  });

  // 签到
  // process:
  // 增加一条记录,用户名为tong,coin为1
  // check:
  // 查看是否存在用户名为tong,coin为1的记录
  it("签到", async function() {
    let userId: string = "tongjinle",
      year: number = 2000,
      month: number = 1,
      date: number = 1,
      timestamp: number = 0,
      coin = 1;
    await serviceIns.sign(userId, year, month, date, timestamp, coin);
    //
    let data = await mongo.getCollection("sign").findOne({ userId });
    assert(data.userId === "tongjinle" && data.coin === 1);
  });

  // 是否已经签到
  // process:
  // 加入一条记录,用户名为tong,时间是2000-1-1
  // check:
  // 1.存在2000-1-1的用户名为tong的记录
  // 2.不存在2000-1-2的用户名为tong的记录
  // 3.不存在2000-1-1的用户名为jin的记录

  it("是否已经签到", async function() {
    await serviceIns.sign("tong", 2000, 1, 1, 0, 1);
    assert(await serviceIns.isSign("tong", 2000, 1, 1));
    assert(!(await serviceIns.isSign("tong", 2000, 1, 2)));
    assert(!(await serviceIns.isSign("jin", 2000, 1, 1)));
  });
});
