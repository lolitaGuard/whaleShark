import assert = require("assert");
import axios, { AxiosInstance } from "axios";
import config from "../../config";
import helper from "../helper";
import * as protocol from "../../protocol";

describe("user.handle", () => {
  before(async () => {
    await helper.openDbs();
  });
  beforeEach(async () => {
    await helper.clearAll();
  });
  after(async () => {
    await helper.closeDbs();
  });

  // 请求token的时候,自动在数据库新建一个用户
  // test模式下,userId就是code
  // process:
  // 1. 请求一个token,code为puman
  // check:
  // 1. 在数据库中查询userId为code的记录
  // 2. 记录的coin默认是为0
  xit("test", async function() {
    let req = await helper.getAxios("puman");

    let res = await req.get("/test/");
    // console.log(res.data);
  });

  it("setInfo", async function() {
    let req = await helper.getAxios("puman");

    let userId = "puman";
    let res = await req.get(`/user/info/${userId}/`);
    let data = res.data.data;
    // console.log(data);
    assert(data && data.coin === 0);
  });

  // process:
  // 1. 请求一个token,code为puman
  // 2. 设置约玩状态为true
  // check:
  // 1. 可以正常设置约玩状态
  // 2. 记录的约玩状态为true
  it("setStatus", async function() {
    this.timeout(10 * 1000);
    let route = "/user/invite/status/set/";
    let req = await helper.getAxios("puman");
    let reqData: protocol.IInviteStatusSetReq = { isInvite: true };
    {
      let res = await req.post(route, reqData);
      let data: protocol.ICommonRes<{}> = res.data;
      assert(data.code === -1);
    }
    let res = await req.get("/user/info/puman/");
    let data: protocol.ICommonRes<protocol.IInfoRes> = res.data;
    assert(data.data.isInvite);
  });

  // process:
  // 1. 请求一个token,code为puman
  // 2. 设置dinner价格为100,movie价格为200
  // 3. 设置dinner价格为300
  // check:
  // 1. 记录的dinner价格为100,movie价格为200
  // 2. 记录的dinner价格为300,movie价格为200
  it("setting", async function() {
    let route = "/user/invite/setting/";
    let req = await helper.getAxios("puman");
    let reqData: protocol.IInviteSettingReq;
    let resData: protocol.ICommonRes<protocol.IInfoRes>;
    reqData = {
      list: [{ type: "dinner", price: 100 }, { type: "movie", price: 200 }]
    };
    await req.post(route, reqData);
    resData = (await req.get("/user/info/puman/")).data;
    assert(
      resData.data.inviteList.find(n => n.name === "dinner").value === 100
    );
    assert(resData.data.inviteList.find(n => n.name === "movie").value === 200);

    reqData = {
      list: [{ type: "dinner", price: 300 }]
    };
    await req.post(route, reqData);
    resData = (await req.get("/user/info/puman/")).data;
    assert(
      resData.data.inviteList.find(n => n.name === "dinner").value === 300
    );
    assert(resData.data.inviteList.find(n => n.name === "movie").value === 200);
  });
});
