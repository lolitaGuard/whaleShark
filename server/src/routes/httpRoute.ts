import * as express from "express";

import config from "../config";
import loger from "../logIns";
import Database from "../mongo";

// 路由
import testHandle from "./testHandle";

// 错误
import { ErrCode } from "../errCode";
import { json } from "body-parser";
import JwtService from "../service/jwtService";

export default function handler(app: express.Express) {
  // token
  // app.use(
  //   "/user/",
  //   jwt({ secret: config.jwt.secret }),
  //   (err, req: express.Request, res: express.Response, next) => {
  //     if (err) {
  //       res.status(500).json(ErrCode.invalidToken);
  //       return;
  //     }
  //     next();
  //   }
  // );
  // app.use(async (req, res, next) => {
  //   if (/^\/user\//.test(req.path)) {
  //     let token: string = req.headers["token"] as string;
  //     JwtService.verify(token)
  //     let service = await TokenService.getIns();
  //     let checkRst = await service.check(token);
  //     console.log({ token, checkRst });
  //     console.log(JSON.stringify(token));
  //     if (!checkRst) {
  //       res.json(ErrCode.invalidToken);
  //       return;
  //     }
  //     let info = await service.getInfo(token);
  //     req.headers["openId"] = info.openId;
  //   }
  //   next();
  // });

  // 测试
  testHandle(app);
}
