import * as express from "express";
import * as multer from "multer";
import * as Stream from "stream";
import Database from "../mongo";
import UploadService from "../service/uploadService";
import * as protocol from "../protocol";
import { ErrCode } from "../errCode";
import logIns from "../logIns";

export default function handle(app: express.Express) {
  // 测试
  app.post(
    "/common/upload/",
    multer({
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    }).any(),
    async (req, res) => {
      let service = await UploadService.getInstance();
      let files: Express.Multer.File[] = req.files as Express.Multer.File[];

      console.log("文件个数:", files.length);
      let arr = files.map(fi => {
        let filename: string = Math.floor(Math.random() * 1e8)
          .toString()
          .slice(0, 8);
        let st = new Stream.PassThrough();
        st.end(fi.buffer);
        return service.upload(filename, st);
      });
      Promise.all(arr)
        .then(data => {
          let rst: protocol.ICommonRes<protocol.IUploadRes> = ErrCode.noErr;
          rst.data = { list: data };
          res.json(rst);
        })
        .catch(e => {
          logIns.info("uploadHandler error:", e);
          res.json(ErrCode.uploadFail);
        });
    }
  );
}
