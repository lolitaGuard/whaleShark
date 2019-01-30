# 用户

## 获取基本信息

### request

`GET` `/user/info/:userId/`

### response

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

## 设置基本信息

### request

`POST` `/user/info/`

```typescript
interface IInfoReq {
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

## 获取约玩项和价格

### request

`GET` `/user/invite/setting/:userId/`

### response

```typescript
interface IInviteSettingReq {
  list: {
    // 约玩名称
    // 约电影,约唱歌,约旅游,约聚餐,约运动,约运动
    type: "movie" | "ktv" | "travel" | "dinner" | "sport";
    // 价格
    price: number;
  }[];
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

## 获取约玩状态

### request

`GET` `/user/invite/status`

### response

```typescript
interface IInviteStatusReq {
  // 是否打开
  isOpen: boolean;
}
```

## 设置约玩状态

### request

`POST` `/user/invite/status/set`

```typescript
interface IInviteStatusSetReq {
  // 是否打开
  isOpen: boolean;
}
```
