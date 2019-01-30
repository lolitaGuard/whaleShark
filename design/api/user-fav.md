# 用户收藏

## 我的收藏列表

### request

`GET` `/fav/list/:pageIndex/:pageSize/`

### response

```typescript
interface IFavListRes {
  list: {
    // 收藏编号
    favId: string;
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

## 收藏

### request

`PUT` `/fav/:favId`

## 取消收藏

### request

`DELETE` `/fav/:favId`
