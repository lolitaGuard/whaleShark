import EDailyUrlType from "./eDailyUrlType";
export default interface IDailyUploadContent {
  // 文本
  content: string;
  // 类型
  type: EDailyUrlType;
  // url地址,除了photo一般就一个
  urlList: string[];
}
