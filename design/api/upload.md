# 上传

## 资源上传

### request

`POST` `/upload/` `multipart/form-data`

### response

```typescript
interface IUploadRes {
  urlList: string[];
}
```

**url 是完整的 url 路径,不需要拼接**
