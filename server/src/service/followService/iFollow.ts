import EFollowStatus from "./eFollowStatus";

export default interface IFollow {
  /**
   * 关注者
   */
  userId: string;

  /**
   * 关注的人
   */
  followId: string;

  /**
   * 相互关注的状态
   */
  status: EFollowStatus;
}
