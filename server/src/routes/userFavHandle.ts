import * as express from "express";
import config from "../config";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";
import UserService from "../service/userService";
import FavService from "../service/favService";
import IUser from "../service/userService/iUser";
import { user } from "../redisKeys";
import IFav from "../service/favService/iFav";
import DailyService from "../service/dailyService/service";

// 检测用户是否存在
const checkUserExists = async (userId: string) => {
  let service = await UserService.getInstance();
  let user = await service.find(userId);
  if (!user) {
    return ErrCode.userNotExists;
  }
};

// daily是否存在

export default function handle(app: express.Express) {
  // 获取用户信息
  app.get("/fav/list/:pageIndex/:pageSize/", async (req, res) => {
    let rst: protocol.ICommonRes<protocol.IFavListRes>;
    let userId: string = req["userId"];
    let pageIndex: number = req.params["pageIndex"] - 0;
    let pageSize: number = req.param["pageSize"] - 0;
    let service = await FavService.getInstance();

    let list = await service.getFavList(userId, pageIndex, pageSize);

    rst = ErrCode.noErr;
    rst.data = { list };
    res.json(rst);
  });

  app.put('/fav/:dailyId',async(req,res)=>{
    let rst :protocol.ICommonRes<{}>;
    let userId :string = req['userId'];
    let dailyId:string = req.params['dailyId']

    let service = await FavService.getInstance();
    let daService:DailyService = await DailyService.getInstance();

    let daily = await  daService.find(dailyId)

    let favItem:IFav = {

 // 收藏者用户编号
 userId,
 // 日记编号
 dailyId,
 // logo
 logoUrl: daily.logoUrl,
 // 昵称
 nickname: daily.nickname,
 // 时间戳
 timestamp: Date.now();
 // 文本
 content: dailyC;
 // 类型
 type: EFavType;
 // 投币数量
 upvote: number;
 // 收藏数量
 favorite: number;
 // 转发数量
 share: number;
    };
    
    service.fav(favItem);
  })
}
