export default interface IUser {
  // 编号
  userId?: string;
  // 昵称
  nickname: string;
  // 性别
  // 0 男生
  // 1 女生
  gender: 0 | 1;
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
}
