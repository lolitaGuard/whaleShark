# Token

## 获取 Token

### request

`GET` `/common/token/:code/`

### response

```typescript
interface ITokenRes {
  //
  token: string;
  // 过期时间戳
  expires: number;
}
```

- 客户端使用
  - expires,用来确定过期时间
  - token 请放在 headers 里面,key 名依旧叫 token
