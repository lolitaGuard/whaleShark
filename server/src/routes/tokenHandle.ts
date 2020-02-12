import * as express from "express";
import jwtService from "../service/jwtService";
import UserService from "../service/userService";
import wx from "../wx";
import config from "../config";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";
import IUser from "../service/userService/iUser";
import logIns from "../logIns";

export default function handle(app: express.Express) {
  app.get("/common/token/:code/", async (req, res) => {
    let rst: protocol.ICommonRes<protocol.ITokenRes>;

    let code: string = req.params.code;
    let openId: string;

    let service = await UserService.getInstance();

    try {
      const env = process.env.NODE_ENV;
      // 测试情况下,使用mock的openId
      if (env === "test") {
        openId = code;
      } else {
        openId = await wx.getOpenId(code);
      }

      let user = await service.find(openId);
      if (!user) {
        let defUser: IUser = createDefaultUser(openId);
        await service.create(defUser);
        logIns.info("create user:", defUser);
      }
    } catch (e) {
      rst = ErrCode.getOpenIdFail;
      res.json(rst);
      return;
    }
    let now: number = Date.now();
    let expires: number = now + config.tokenExpires;
    let info = { userId: openId, expires };
    let token: string = jwtService.sign(info);
    rst = ErrCode.noErr;
    rst.data = { token, expires };
    res.json(rst);
  });
}

function createDefaultUser(userId: string): IUser {
  let rst: IUser;
  rst = {
    userId,
    // 昵称
    nickname: "nickname",
    // 性别
    gender: "male",
    // 生年
    birthYear: 1900,
    // 城市
    city: "上海",
    // 微信
    wx: "wx",
    // qq
    qq: "qq",
    // 约玩状态
    inviteStatus: false,
    // 约玩价格
    priceList: [],
    // 统计
    // 总关注
    follow: 0,
    // 总点赞
    upvote: 0,
    // 总日记数量
    daily: 0,
    // 总热度
    hot: 0,
    // 总约玩
    invite: 0,
    // 总转发
    share: 0,
    // 硬币
    coin: 0
  };
  return rst;
}
