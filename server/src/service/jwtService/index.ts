import * as jwt from "jsonwebtoken";
import config from "../../config";
import IToken from "./iToken";

const JWT_SECRET: string = config.jwt.secret;

export default class JwtService {
  /**
   * 给明文生成一段token
   * @param  {IToken} info 明文
   * @returns string token密文
   */
  static sign(info: IToken): string {
    return jwt.sign(info, JWT_SECRET);
  }
  /**
   * 解密token
   * @param  {string} token
   * @returns IToken 解密的token信息,如果解密失败,则返回undefined
   */
  static verify(token: string): IToken {
    try {
      return jwt.verify(token, JWT_SECRET) as IToken;
    } catch (e) {
      return undefined;
    }
  }
}
