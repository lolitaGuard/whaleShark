import * as Http from "http";
import * as Https from "https";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import * as jwt from "express-jwt";
import { ErrCode } from "./errCode";
import loger from "./logIns";
import config from "./config";

import httpRouteHandle from "./routes/httpRoute";

class Main {
  // express实例
  app: express.Express;

  constructor() {
    this.app = express();
    this.initHttpRoute();
  }

  // 挂载http路由
  initHttpRoute(): void {
    let app = this.app;

    // 中间件
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // 过滤掉option
    app.use((req, res, next) => {
      loger.info("req.path", req.path, req.method);
      if (req.method == "OPTIONS") {
        next();
        return;
      }

      next();
    });

    // cors
    app.all("*", (req: express.Request, res: express.Response, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    // token
    app.use(
      "/user/",
      jwt({ secret: config.jwt.secret }),
      (err, req: express.Request, res: express.Response, next) => {
        if (err) {
          res.status(500).json(ErrCode.invalidToken);
          return;
        }
        next();
      }
    );

    // 路由
    httpRouteHandle(app);

    // 启动
    let { port } = config;
    let cb = () => {
      loger.info("=======================================");
      loger.info(new Date().getTime().toString());
      loger.info(`** start https server at port(${port}) **`);
      loger.info("=======================================");

      if (process.env.NODE_ENV === "dev") {
        loger.info(`visit url: ${config.apiPrefix}:${config.port}/test`);
        loger.info(`visit url: ${config.apiPrefix}:${config.port}/test/db`);
      }
    };

    if ("product" === process.env.NODE_ENV) {
      // 启动https
      let opts: Https.ServerOptions = {
        key: fs.readFileSync("./cert/index.key"),
        cert: fs.readFileSync("./cert/index.pem")
      };
      let httpsServer = Https.createServer(opts, app);
      // https end

      httpsServer.listen(port, cb);
    } else {
      app.listen(port, cb);
    }
  }
}

new Main();
