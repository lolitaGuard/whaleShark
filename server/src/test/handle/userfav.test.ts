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
  it("test", async function() {
    let req = await helper.getAxios("puman");

    let res = await req.get("/test/");
    // console.log(res.data);
  });
});
