import assert = require("assert");

import jwtService from "../../service/jwtService";
import iToken from "../../service/jwtService/iToken";
describe("token", () => {
  // token的创建和解密
  // process:
  // 创建一个'tongjinle',expries为2000-1-1的token
  // check:
  // 查看解密的信息,userId是否是'tongjinle',expires是否是2000-1-1的时间戳
  it("jwt-token", function() {
    let info: iToken = {
      userId: "tongjinle",
      expires: new Date(2000, 0, 1).getTime()
    };
    let token: string = jwtService.sign(info);

    let decodeInfo = jwtService.verify(token);
    assert(
      decodeInfo.userId === "tongjinle" &&
        decodeInfo.expires === new Date(2000, 0, 1).getTime()
    );
  });

  // 不合法的token的解密
  // process:
  // 解密一个不合法的token
  // check:
  // 解密出来的信息是undefined(即解密有错)
  it("invaild-token", function() {
    let token: string = "abc";
    let decodeInfo = jwtService.verify(token);
    assert(!decodeInfo);
  });
});
