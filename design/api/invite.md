## 约玩申请

### request

`PUT` `/invite/insert/`

```typescript
interface IInviteRes {
  // 邀请者
  userId: string;
  // 被邀请者
  hostId: string;
  // 硬币价格
  coin: number;
  // 地点
  address: string;
  // 时间,格式为时间戳
  timestamp: number;
  // 是否邀请者来接
  pickUp: boolean;
  // 是否可以带闺蜜
  companion: boolean;
  // 留言-文字
  content: string;
  // 留言-图片
  picUrlList: string[];
  // 留言-语音
  audioUrl: string;
}
```

## 我的约玩列表

### request

`GET` `/invite/list/:pageIndex/:pageSize/:isAll`

- isAll
  - true,表示查询所有约玩记录
  - false,表示查询目前进行中的约玩记录

### response

```typescript
interface IInviteListRes {
  list: {
    // 约玩单子编号
    inviteId: string;
    // 头像url
    logoUrl: string;
    // 昵称
    nickname: string;
    // 状态
    // 申请中,进行中,已拒绝,成功结单,失败
    status: "apply" | "dating" | "reject" | "success" | "fail";
    // 类型
    type: "movie" | "game online" | "travel" | "dinner" | "other";
    // 时间
    timestamp: number;
    // 地点
    address: string;
    // 可否带闺蜜
    companion: boolean;
  }[];
}
```

## 单个约玩单子详情

### request

`GET` `/invite/detail/:inviteId`

### response

```typescript
interface IInviteDetailRes {
  // 约玩单子编号
  inviteId: string;
  // 头像url
  logoUrl: string;
  // 昵称
  nickname: string;
  // 状态
  // 申请中,进行中,已拒绝,成功结单,失败
  status: "apply" | "dating" | "reject" | "success" | "fail";
  // 类型
  type: "movie" | "game online" | "travel" | "dinner" | "other";
  // 时间
  timestamp: number;
  // 地点
  address: string;
  // 可否带闺蜜
  companion: boolean;
  // 是否邀请者来接
  pickUp: boolean;
  // 图片url列表
  photoUrlList: string[];
  // 语音url
  audioUrl: string;
}
```

## 处理约玩邀请(拒绝/接受)

### request

`POST` `/invite/action/`

```typescript
interface IInviteAction {
  // 处理者用户编号
  userId: string;
  // 约玩单子编号
  inviteId: string;
  // 处理方式
  // 接受,拒绝
  action: "accept" | "reject";
}
```

## 约玩结果确认

### request

`POST` `/invite/confirm/`

```typescript
interface IInviteComfirm {
  // 处理者用户编号
  userId: string;
  // 约玩单子编号
  inviteId: string;
  // 处理方式
  // 确认约玩成功,确认约玩失败
  comfirm: "success" | "fail";
}
```

### response

```typescript
interface IInviteComfirm {
  // 约玩单子编号
  inviteId: string;
  // 处理结果
  // 约玩成功,约玩失败
  // 邀请者的确认
  user: "success" | "fail";
  // 被邀请者的确认
  host: "success" | "fail";
}
```
