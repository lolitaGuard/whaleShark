export default interface IInviteApply {
  // 邀请者
  userId: string;
  // 被邀请者
  hostId: string;
  // 硬币价格
  coin: number;
  // 地点
  address: string;
  // 时间,格式为时间戳
  timestamp: number;
  // 是否邀请者来接
  pickUp: boolean;
  // 是否可以带闺蜜
  companion: boolean;
  // 留言-文字
  content: string;
  // 留言-图片
  picUrlList: string[];
  // 留言-语音
  audioUrl: string;
}
