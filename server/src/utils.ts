import config from "./config";
import Database from "./mongo";

// *** 存放一些通用方法 ***

function getPrefix(protocol: string, host: string, port: number): string {
  return `${protocol}://${host}:${port}`;
}

function getDefaultPrefix(): string {
  return getPrefix(config.protocol, config.host, config.port);
}

let utils = {
  getPrefix,
  getDefaultPrefix
};

export default utils;
