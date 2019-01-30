import * as express from "express";
import jwtService from "../service/jwtService";
import wx from "../wx";
import config from "../config";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";

export default function handle(app: express.Express) {
  app.get("/common/token/:code", async (req, res) => {
    let rst: protocol.ICommonRes<protocol.ITokenRes>;

    let code: string = req.params.code;
    let openId: string;
    try {
      openId = await wx.getOpenId(code);
    } catch (e) {
      rst = ErrCode.getOpenIdFail;
      res.json(rst);
      return;
    }
    let now: number = Date.now();
    let expires: number = now + config.tokenExpires;
    let info = { userId: openId, expires };
    let token: string = config.jwt.prefix + jwtService.sign(info);
    rst = ErrCode.noErr;
    rst.data = { token, expires };
    res.json(rst);
  });
}
