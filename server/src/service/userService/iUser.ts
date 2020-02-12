export default interface IUser {
  // 编号
  userId?: string;
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
  // daily统计信息
  // 硬币
  coin: number;
  // 约玩状态
  inviteStatus: boolean;
  // 约玩价格
  priceList: { name: string; value: number }[];
  // 统计
  // 点赞总数
  upvote: number;
  // 关注总数(粉丝总数)
  follow: number;
  // 约玩总数
  invite: number;
  // 总转发
  share: number;
  // 热度
  hot: number;
  // 日记总数
  daily: number;
}
