import * as OSS from "ali-oss";
import config from "../../config";
import * as Stream from "stream";

export default class UploadService {
  private static ins: UploadService;
  /**
   * 获取FavService实例
   * @returns Promise<FavService>
   */
  static async getInstance(): Promise<UploadService> {
    if (!UploadService.ins) {
      let ins = (UploadService.ins = new UploadService());
    }
    return UploadService.ins;
  }

  client: OSS;

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

    rst = config.oss.prefix + "/" + remoteName;
    return rst;
  }
}
