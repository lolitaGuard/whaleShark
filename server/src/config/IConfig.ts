interface IConfig {
  protocol: string;
  host: string;
  port: number;

  // mongo
  connectStr: string;
  dbName: string;

  // 微信
  wx: {
    appId: string;
    appSecret: string;
    templateId: string;
  };
  // token过期时间
  tokenExpires: number;

  // mock
  mockToken: string;
  mockOpenId: string;

  // redis
  redis: {
    // 主机
    host: string;
    // 端口
    port: number;
    // 密码
    pass: string;
  };

  // jwt
  jwt: {
    /**
     * jsonwebtoken密钥
     */
    secret: string;
    prefix: string;
  };

  oss: {
    region: string;
    bucket: string;
    accessKeyId: string;
    accessKeySecret: string;
    // 域名前缀
    prefix: string;
    // 文件夹
    dir: string;
  };

  recommend: {
    // 缓存的city列表
    citys: string[];
    // 最大的缓存页数
    pageIndexMax: number;
  };
}

export default IConfig;
