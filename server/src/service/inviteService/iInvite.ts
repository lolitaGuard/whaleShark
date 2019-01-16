import EInviteType from "./eInviteType";
import EInviteStatus from "./eInviteStatus";
export default interface IInviteItem {
  // 约玩单子编号
  inviteId?: string;
  // 邀请者
  userId: string;
  // 头像url
  logoUrl: string;
  // 昵称
  nickname: string;
  // 被邀请者
  guestId: string;
  // 被邀请者-头像url
  guestLogoUrl: string;
  // 被邀请者-昵称
  guestNickname: string;
  // 邀请者的确认,-1未确认,0确认失败,1确认成功
  userConfirm: -1 | 0 | 1;
  // 被邀请者的确认
  guestConfirm: -1 | 0 | 1;
  // 状态
  // 申请中,进行中,已拒绝,成功结单,失败结单
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
