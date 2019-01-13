import EFavType from "./eFavType";
export default interface IFav {
  // 收藏编号
  favId?: string;
  // 收藏者用户编号
  userId: string;
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
  type: EFavType;
  // 投币数量
  upvote: number;
  // 收藏数量
  favorite: number;
  // 转发数量
  share: number;
}
