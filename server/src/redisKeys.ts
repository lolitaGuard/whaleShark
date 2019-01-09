// flag
export let flag = (key: string) => `flag#${key}`;

// 用户信息
export let user = (userId: string) => `user#${userId}`;

// 用户约玩价格
export let price = (userId: string, priceName: string) =>
  `price#${userId}#${priceName}`;

// 用户约玩状态
export let inviteStatus = (userId: string) => `inviteStatus#${userId}`;

// 用户签到标记
export let userSign = (userId: string, day: string) =>
  `user#sign#${userId}#${day}`;

// 用户转发标记
export let userInvite = (userId: string, day: string) =>
  `user#invite#${userId}#${day}`;
