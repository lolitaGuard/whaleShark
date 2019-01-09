export default interface ISign {
  /**
   * 签到用户编号
   */
  userId: string;
  /**
   * 年
   */
  year: number;
  /**
   * 月,从1开始数
   */
  month: number;
  /**
   * 日
   */
  date: number;
  /**
   * 签到的时间戳
   */
  timestamp: number;
  /**
   * 签到获得的硬币
   */
  coin: number;
}
