# 颜值日记

## 颜值日记统计信息

### request

`GET` `/daily/statistics/:userId/`

### response

```typescript
interface IDailyStatisticsRes {
  // logo
  logoUrl: string;
  // 昵称
  nickname: string;
  // 赞(总数)
  upvote: number;
  // 被关注/粉丝(总数)
  follow: number;
  // 热度
  hot: number;
  // 约玩(总数)
  invite: number;
}
```

## 颜值日记列表

### request

`GET` `/daily/list/:userId/:pageIndex/:pageSize/`

### response

```typescript
interface IDailyListRes {
  list: {
    // 日记编号
    dailyId: string;
    // logo
    logoUrl: string;
    // 昵称
    nickname: string;
    // 时间戳
    timestamp: number;
    // 文本
    content: string;
    // 类型
    type: "audio" | "video" | "photo";
    // 投币数量
    upvote: number;
    // 收藏数量
    favorite: number;
    // 转发数量
    share: number;
  }[];
}
```

## 上传日记

### request

`PUT` `/daily/insert/`

```typescript
interface IDailyInsertReq {
  // 文本
  content: string;
  // 类型
  type: "audio" | "video" | "photo";
  // url地址,除了photo一般就一个
  urlList: string[];
}
```

## 删除日记

`DELETE` `/daily/:dailyId/`

## 投币留言

### request

`POST` `/daily/upvote/`

```typescript
interface IUpvoteReq {
  // 投币者编号
  userId: string;
  // 主人用户编号
  hostId: string;
  // 留言,投币者可以不留言
  content: string;
  // 投币数量
  coin: number;
}
```

## 转发

### request

`POST` `/daily/share/`

```typescript
interface IShareRES {
  // 转发者编号
  userId: string;
  // 日记编号
  dailyId: string;
}
```
