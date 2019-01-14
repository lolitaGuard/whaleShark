import EDailyUrlType from "./eDailyUrlType";

export default interface IDaily {
  // 日记编号
  dailyId?: string;
  // 用户编号
  userId: string;
  // logo
  logoUrl: string;
  // 昵称
  nickname: string;
  // 时间戳
  timestamp: number;
  // 文本
  content: string;
  // 类型
  type: EDailyUrlType;
  // 资源url
  urlList: string[];
  // 投币数量
  upvote: number;
  // 收藏数量
  fav: number;
  // 转发数量
  share: number;
}
