# 上传

## 资源上传

### request

`POST` `/common/upload/` `multipart/form-data`

### response

```typescript
interface IUploadRes {
  list: string[];
}
```

**url 是完整的 url 路径,不需要拼接**
