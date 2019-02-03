import { inflateRaw } from "zlib";

// *** 基础response格式
// *** 带有code[错误码]和msg[错误信息]
// *** 当code===undefined的时候,表示正确
export interface IErrRes {
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

export interface IUploadRes {
  list: string[];
}

export interface IInfoRes {
  // 昵称
  nickname: string;
  // 性别
  gender: "male" | "female";
  // 生年
  birthYear: number;
  // 城市
  city: string;
  // 微信
  wx: string;
  // qq
  qq: string;
  // 是否开启约玩
  isInvite: boolean;
  // 约玩列表
  inviteList: { name: string; value: number }[];
  // 统计
  // 总关注
  follow: number;
  // 总点赞
  upvote: number;
  // 总日记数量
  daily: number;
  // 总热度
  hot: number;
  // 总约玩
  invite: number;
  // 硬币
  coin: number;
}

// 设置基本信息
export interface IInfoReq {
  // 昵称
  nickname: string;
  // 性别
  gender: "male" | "female";
  // 生年
  birthYear: number;
  // 城市
  city: string;
  // 微信
  wx: string;
  // qq
  qq: string;
}

// 设置约玩价格
export interface IInviteSettingReq {
  list: {
    // 约玩名称
    // 约电影,约唱歌,约旅游,约聚餐,约运动,约运动
    type: "movie" | "ktv" | "travel" | "dinner" | "sport";
    // 价格
    // 特殊值-1表示反选该约玩项
    price: number;
  }[];
}

// 设置是否开启约玩
export interface IInviteStatusSetReq {
  // 是否打开
  isInvite: boolean;
}

export interface ICommonRes<T> extends IErrRes {
  data?: T;
}
