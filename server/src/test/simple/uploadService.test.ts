import assert = require("assert");
import { Buffer } from "buffer";
import * as Stream from "stream";
import UploadService from "../../service/uploadService";

describe("uploadService", async function() {
  let serviceIns: UploadService;
  before(async function() {
    serviceIns = await UploadService.getInstance();
  });
  // 上传
  // process:
  // 1. 上传一个文本文件上去
  // check:
  // 1. 资源可以被读到
  it("upload", async function() {
    this.timeout(10 * 1000);

    try {
      let st = new Stream.PassThrough();
      st.end("hello world");
      let url: string = await serviceIns.upload("hi", st);
      console.log(url);
      assert(true);
    } catch (e) {
      assert(false);
    }
  });
});
