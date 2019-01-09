import assert = require("assert");

// var assert = require("power-assert");
import jwtService from "../../service/jwtService";
import iToken from "../../service/jwtService/iToken";
describe("token", () => {
  it("jwt-token", () => {
    let info: iToken = {
      userId: "tongjinle",
      expires: new Date(2000, 0, 1).getTime()
    };
    let token: string = jwtService.sign(info);

    let decodeInfo = jwtService.verify(token);
    assert(decodeInfo.userId === "tongjinle");
  });
});
