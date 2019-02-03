import assert = require("assert");
import axios from "axios";
import utils from "../../utils";
import jwtService from "../../service/jwtService";
import config from "../../config";
import * as protocol from "../../protocol";
axios.defaults.baseURL = utils.getDefaultPrefix();

describe("token", async function() {
  it("token", async function() {
    let code = "puman";
    let res = await axios.get("/common/token/" + code);
    let data: protocol.ITokenRes = res.data.data;
    let decode = jwtService.verify(data.token);

    assert(decode && decode.userId === "puman");
  });
});
