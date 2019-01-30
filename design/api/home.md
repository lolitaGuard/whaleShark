# 主页

## 获取推荐列表

### request

`GET` `/home/recommend/`

```typescript
interface IRecommendReq {
  // 城市,
  // 不传入city参数,则表示所有城市
  city?: string;
  // 是否开启线下约玩
  // true表示只搜索有线下约玩的女生
  // false表示所有
  isInvite: boolean;
  // 约玩项
  // 如果isInvite为false,则此项显然无意义
  inviteList: string[];
}
```

### response

```typescript
interface IRecommendRes {
  list: {
    // 图片url
    photoUrl: string;
    // 昵称
    nickname: string;
    // 生年
    birth: number;
    // 性别
    gender: "male" | "female";
    // 城市
    city: string;
    // 日记数量
    dailyCount: number;
  }[];
}
```
