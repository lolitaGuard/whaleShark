import * as express from "express";
// 路由
import testHandle from "./testHandle";
import tokenHandle from "./tokenHandle";
import uploadHandle from "./uploadHandle";
// 错误
import { ErrCode } from "../errCode";
// jwt
import JwtService from "../service/jwtService";

export default function handler(app: express.Express) {
  // token
  app.use("/user/", (req: express.Request, res: express.Response, next) => {
    if (/^\/user\//.test(req.path)) {
      let token: string = req.headers["token"] as string;
      let decode = JwtService.verify(token);
      if (!decode || decode.expires < Date.now()) {
        res.json(ErrCode.invalidToken);
        return;
      }
    }
    next();
  });

  // token
  tokenHandle(app);

  // upload
  uploadHandle(app);

  // 测试
  testHandle(app);
}
