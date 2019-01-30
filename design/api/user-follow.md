# 用户关注

## 我的关注列表

### request

`GET` `/follow/list/:pageIndex/:pageSize/`

### response

```typescript
interface IFollowListRes {
  list: {
    // logo
    logo: string;
    // 昵称
    nickname: string;
    // 状态
    // '双向关注','关注了我','关注了他'
    status: "each" | "me" | "ta";
  }[];
}
```

## 关注

### request

`PUT` `/follow/:userId`

## 取消关注

### request

`DELETE` `/follow/:userId`
