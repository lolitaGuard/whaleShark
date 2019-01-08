// *** 基础response格式
// *** 带有code[错误码]和msg[错误信息]
// *** 当code===undefined的时候,表示正确
export interface IResErr {
  // 错误码
  code: number;
  // 错误信息
  message: string;
}

export interface ITokenRes {
  token: string;
  // 过期时间戳
  expires: number;
}
