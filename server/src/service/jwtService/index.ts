import * as jwt from "jsonwebtoken";
import config from "../../config";
import IToken from "./iToken";

const JWT_SECRET: string = config.jwt.secret;

export default class JwtService {
  static sign(info: IToken): string {
    return jwt.sign(info, JWT_SECRET);
  }

  static verify(token: string): IToken {
    return jwt.verify(token, JWT_SECRET) as IToken;
  }
}
