var assert = require("power-assert");
import jwtService from "../../service/jwtService";
describe("token", () => {
  it("jwt-token", () => {
    let info = {
      openId: "tongjinle",
      expires: new Date(2000, 0, 1).getTime()
    };
    let token: string = jwtService.sign(info);

    let decodeInfo = jwtService.verify(token);
    console.log(decodeInfo);
  });
});
