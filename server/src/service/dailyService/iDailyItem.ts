import EDailyUrlType from "./eDailyUrlType";

export default interface IDailyItem {
  // 日记编号
  dailyId: string;
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
  // 投币数量
  upvote: number;
  // 收藏数量
  favorite: number;
  // 转发数量
  share: number;
}