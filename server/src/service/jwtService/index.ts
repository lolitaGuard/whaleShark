import * as jwt from "jsonwebtoken";
import config from "../../config";

const JWT_SECRET: string = config.jwt.secret;

export default class JwtService {
  static sign(info: any): string {
    return jwt.sign(info, JWT_SECRET);
  }

  static verify(token: string): string | object {
    return jwt.verify(token, JWT_SECRET);
  }
}
