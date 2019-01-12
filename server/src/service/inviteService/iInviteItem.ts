import EInviteType from "./eInviteType";
import EInviteStatus from "./eInviteStatus";
export default interface IInviteItem {
  // 约玩单子编号
  inviteId: string;
  // 头像url
  logoUrl: string;
  // 昵称
  nickname: string;
  // 状态
  // 申请中,进行中,已拒绝,成功结单,失败
  status: EInviteStatus;
  // 类型
  type: EInviteType;
  // 时间
  timestamp: number;
  // 地点
  address: string;
  // 可否带闺蜜
  companion: boolean;
}
