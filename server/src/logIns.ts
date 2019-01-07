import * as log4js from "log4js";

log4js.configure({
  appenders: [
    // { type: "console" }
    {
      type: "dateFile",
      filename: "./logs/app.log",
      maxLogSize: 20480,
      backups: 3,
      category: "app"
    }
  ]
});

let ins: log4js.Logger;

let getIns = () => {
  ins = ins || log4js.getLogger("app");
  return ins;
};

export default getIns();
