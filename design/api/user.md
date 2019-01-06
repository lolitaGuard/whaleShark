# 用户

## 设置基本信息

### request

`POST` `/user/setting/`

```typescript
interface ISettingReq {
  // 昵称
  nickname: string;
  // 性别
  gender: number;
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
  // 约玩名称
  // 约电影,约线上游戏,约旅游,约聚餐,约其他
  type: "movie" | "game online" | "travel" | "dinner" | "other";
  // 价格
  // 特殊值-1表示反选该约玩项
  price: number;
}
```

## 获取当前约玩的开关状态

### request

`GET` `/user/invite/status`

### response

```typescript
interface IInviteStatusReq {
  // 是否打开
  isOpen: boolean;
}
```

## 开关约玩

### request

`POST` `/user/invite/status/set`

```typescript
interface IInviteStatusSetReq {
  // 是否打开
  isOpen: boolean;
}
```
