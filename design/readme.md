# 前言

## response 的一般格式

```typescript
{
  // 错误码
  // -1表示没有错误
  // 其他错误请查看错误码章节
  code: number;
  // 错误信息
  message: string;
  // 数据
  data: any;
}
```

**在 api 文档中,只写 response 的 data 部分**

## method 的一般约定

| method   | 解释      |
| -------- | --------- |
| `GET`    | 搜索,获取 |
| `POST`   | 修改      |
| `PUT`    | 新增      |
| `DELETE` | 删除      |
