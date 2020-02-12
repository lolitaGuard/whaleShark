import * as express from "express";
import config from "../config";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";
import UserService from "../service/userService";
import IUser from "../service/userService/iUser";
import { user } from "../redisKeys";

// 检测用户是否存在
const checkUserExists = async (userId: string) => {
  let service = await UserService.getInstance();
  let user = await service.find(userId);
  if (!user) {
    return ErrCode.userNotExists;
  }
};

export default function handle(app: express.Express) {
  // 获取用户信息
  app.get("/user/info/:userId/", async (req, res) => {
    let rst: protocol.ICommonRes<protocol.IInfoRes>;
    let userId: string = req.params["userId"];
    let service = await UserService.getInstance();
    let info: IUser = await service.find(userId);

    if (!info) {
      rst = ErrCode.userNotExists;
      res.json(rst);
      return;
    }
    rst = ErrCode.noErr;
    rst.data = {
      nickname: info.nickname,
      birthYear: info.birthYear,
      gender: info.gender,
      city: info.city,
      wx: info.wx,
      qq: info.qq,
      isInvite: info.inviteStatus,
      inviteList: info.priceList,
      upvote: info.upvote,
      follow: info.follow,
      daily: info.daily,
      invite: info.invite,
      share: info.share,
      hot: info.hot,
      coin: info.coin
    };
    res.json(rst);
  });

  // 设置用户约玩状态
  app.post("/user/invite/status/set/", async (req, res) => {
    let rst: protocol.ICommonRes<{}>;
    let data: protocol.IInviteStatusSetReq = req.body;
    let userId: string = req["userId"];

    let checkRst = await checkUserExists(userId);
    if (checkRst) {
      res.json(checkRst);
      return;
    }

    let service = await UserService.getInstance();
    await service.setInviteStatus(userId, data.isInvite);

    rst = ErrCode.noErr;
    res.json(rst);
  });

  // 设置用户约玩价格
  app.post("/user/invite/setting/", async (req, res) => {
    let rst: protocol.ICommonRes<{}>;
    let data: protocol.IInviteSettingReq = req.body;
    let userId: string = req["userId"];
    let service = await UserService.getInstance();

    await Promise.all(
      data.list.map(async n => {
        await service.setPrice(userId, n.type, n.price);
      })
    );

    rst = ErrCode.noErr;
    res.json(rst);
  });
}
