import * as express from "express";
import config from "../config";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";
import UserService from "../service/userService";

export default function handle(app: express.Express) {
  app.get("/user/info/:user", async (req, res) => {
    let rst: protocol.IResErr | protocol.ITokenRes;

    res.json(rst);
  });
}
