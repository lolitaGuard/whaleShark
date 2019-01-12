export interface IErr {
  code: number;
  message: string;
}

export class ErrCode {
  // 正确
  static noErr: IErr = { code: -1, message: "" };
  // 500错
  static internalErr: IErr = { code: 500, message: "服务器内部错" };
  // 通用
  static invalidToken: IErr = { code: 800, message: "非法token" };
  static getOpenIdFail: IErr = { code: 801, message: "获取openid失败" };
  static getTokenFail: IErr = { code: 802, message: "获取token失败" };
  // 用户
  static notLogin: IErr = { code: 900, message: "用户未登录" };
  static userExists: IErr = { code: 901, message: "用户已经存在" };

  // special for project
  static invalidAddPointType: IErr = {
    code: 900,
    message: "非法的增加point的方式"
  };

  static invalidCurrentIndex: IErr = {
    code: 901,
    message: "没有对应的正在进行的竞赛"
  };

  static invalidUperId: IErr = { code: 902, message: "非法的up主" };
  static invalidUpvoterId: IErr = { code: 903, message: "打榜者不存在" };
  static invalidUpvoteType: IErr = { code: 904, message: "非法的打榜类型" };
  static notEnoughPoint: IErr = { code: 905, message: "缺乏足够的point" };
  static signAgain: IErr = { code: 906, message: "重复签到" };
  static inviteTooMuch: IErr = { code: 907, message: "转发奖励到达上限" };
  static hasWinner: IErr = { code: 908, message: "冠军已经产生" };
}