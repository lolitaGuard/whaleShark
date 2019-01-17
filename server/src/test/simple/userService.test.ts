import assert = require("assert");
import { openDbs } from "../../dbManager";
import Mongo from "../../mongo";
import { IHandyRedis, ICreateHandyClient } from "handy-redis";
import * as keys from "../../redisKeys";
import helper from "../helper";

import UserService from "../../service/userService";
import IUser from "../../service/userService/iUser";

describe("userService", async function() {
  let mongo: Mongo, redis: IHandyRedis;
  let serviceIns: UserService;
  before(async function async() {
    let db = await openDbs();
    mongo = db.mongo;
    redis = db.redis;

    serviceIns = await UserService.getInstance();
  });

  beforeEach(async function() {
    this.timeout(10 * 1000);
    await helper.clearAll();
  });

  after(async function() {
    await helper.closeDbs();
  });

  // 新建一个用户,返回其userId
  async function createUser(nickname: string): Promise<string> {
    let rst: string;

    let user: IUser = {
      nickname,
      gender: 0,
      birthYear: 2000,
      city: "shanghai",
      wx: "",
      qq: "",
      coin: 0,
      inviteStatus: false,
      priceList: []
    };
    await serviceIns.create(user);

    let data = await mongo.getCollection("user").findOne({ nickname });
    if (data) {
      rst = data._id.toString();
    }

    return rst;
  }

  // 新增一个用户
  // process:
  // 1. 新增一个nickname为tong的用户
  // check:
  // 1. 可以查询到用户tong
  // 2. 不能查询到用户jin
  it("新增一个用户", async function() {
    let userId: string = await createUser("tong");
    assert(await mongo.getCollection("user").findOne({ nickname: "tong" }));
    assert(!(await mongo.getCollection("user").findOne({ nickname: "jin" })));
  });

  // 查询一个用户
  // process:
  // 1. 新增一个nickname为tong的用户
  // 2. 查询这个用户
  // check:
  // 1. 可以查询到用户tong
  // 2. tong的信息被缓存了
  it("查询一个用户", async function() {
    let userId: string = await createUser("tong");
    let user: IUser = await serviceIns.find(userId);
    assert(!!user && user.userId === userId && user.nickname === "tong");
    assert(await redis.exists(keys.user(userId)));
  });

  // 设置用户信息
  // process:
  // 1. 新增一个nickname为tong的用户
  // 2. 设置其城市为shanlian
  // check:
  // 1. 可以查询到用户的city改变为shanlian
  it("设置用户信息", async function() {
    let userId: string = await createUser("tong");
    await serviceIns.setInfo(userId, { city: "shanlian" });

    let user: IUser = await serviceIns.find(userId);
    assert(user.city === "shanlian");
  });

  // 修改约玩状态
  // process:
  // 1. 新增一个nickname为tong的用户
  // 2. tong的约玩状态修改为开启
  // check:
  // 1. tong的约玩状态为开启
  it("修改约玩状态", async function() {
    let userId: string = await createUser("tong");
    await serviceIns.setInviteStatus(userId, true);

    let user: IUser = await serviceIns.find(userId);
    assert(user.inviteStatus);
  });

  // 设置约玩价格
  // process:
  // 1. 新增一个nickname为tong的用户
  // 2. 设置tong的abc约玩价格为100
  // 3. 设置tong的def约玩价格为200
  // 4. 设置tong的abc约玩价格为300
  // check:
  // 1. tong的abc约玩价格为100,def约玩价格为200

  it("设置约玩价格", async function() {
    let userId: string = await createUser("tong");
    {
      await serviceIns.setPrice(userId, "abc", 100);
      await serviceIns.setPrice(userId, "def", 200);

      let user: IUser = await serviceIns.find(userId);
      assert(
        user &&
          user.priceList.find(n => n.name === "abc") &&
          user.priceList.find(n => n.name === "abc").value === 100
      );
      assert(
        user &&
          user.priceList.find(n => n.name === "def") &&
          user.priceList.find(n => n.name === "def").value === 200
      );
    }
    {
      await serviceIns.setPrice(userId, "abc", 300);
      let user: IUser = await serviceIns.find(userId);
      assert(
        user &&
          user.priceList.find(n => n.name === "abc") &&
          user.priceList.find(n => n.name === "abc").value === 300
      );
    }
  });

  // 设置用户coin增量
  // process:
  // 1. 新增一个nickname为tong的用户
  // 2. 设置tong的coin为100
  // 3. 新增tong的coin,10个coin
  // check:
  // 1. tong的coin应该是110个coin
  it("设置用户coin增量", async function() {
    let userId: string = await createUser("tong");
    await serviceIns.setInfo(userId, { coin: 100 });
    await serviceIns.addCoin(userId, 10);

    let user: IUser = await serviceIns.find(userId);
    assert(user && user.coin === 110);
  });
});
