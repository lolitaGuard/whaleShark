import * as OSS from "ali-oss";
import config from "../../config";
import * as Stream from "stream";

export default class UploadService {
  private static ins: UploadService;
  /**
   * 获取UploadService实例
   * @returns Promise<UploadService>
   */
  static async getInstance(): Promise<UploadService> {
    if (!UploadService.ins) {
      let ins = (UploadService.ins = new UploadService());
    }
    return UploadService.ins;
  }

  private client: OSS;

  constructor() {
    this.client = new OSS(config.oss);
  }

  /**
   * Uploads upload service
   * @param remoteName 远程的文件名
   * @param stream 流
   * @returns
   */
  async upload(remoteName: string, stream: Stream): Promise<string> {
    let rst: string;
    await this.client.putStream(config.oss.dir + "/" + remoteName, stream);

    rst = config.oss.prefix + "/" + config.oss.dir + "/" + remoteName;
    return rst;
  }
}
