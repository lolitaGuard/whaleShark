# 用户

## 获取自己的基本信息

### request

`GET` `/user/info/:userId/`

### response

```typescript
interface IInfoRes {
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
  // 是否开启约玩
  isInvite: boolean;
  // 约玩列表
  inviteList: { name: string; value: number }[];
  // 统计
  // 总关注
  follow: number;
  // 总点赞
  upvote: number;
  // 总日记数量
  daily: number;
  // 总热度
  hot: number;
  // 总约玩
  invite: number;
  // 硬币
  coin: number;
}
```

## 设置基本信息

### request

`POST` `/user/info/`

```typescript
interface IInfoReq {
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
}
```

## 设置约玩项和价格

### request

`POST` `/user/invite/setting`

```typescript
interface IInviteSettingReq {
  list: {
    // 约玩名称
    // 约电影,约唱歌,约旅游,约聚餐,约运动,约运动
    type: "movie" | "ktv" | "travel" | "dinner" | "sport";
    // 价格
    // 特殊值-1表示反选该约玩项
    price: number;
  }[];
}
```

## 设置约玩状态

### request

`POST` `/user/invite/status/set`

```typescript
interface IInviteStatusSetReq {
  // 是否打开
  isInvite: boolean;
}
```
