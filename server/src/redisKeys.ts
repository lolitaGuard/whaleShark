// flag
export let flag = (key: string) => `flag#${key}`;

// 用户信息
export let user = (userId: string) => `user#${userId}`;

// 用户约玩价格
export let price = (userId: string, priceName: string) =>
  `price#${userId}#${priceName}`;

// 用户约玩状态
export let inviteStatus = (userId: string) => `inviteStatus#${userId}`;

// 关注列表
export let followList = (userId: string, pageIndex: number) =>
  `followList#${userId}#${pageIndex}`;

// 收藏列表
export let favList = (userId: string, pageIndex: number) =>
  `favList#${userId}#${pageIndex}`;

// 用户签到标记
export let sign = (userId: string, year: number, month: number, date: number) =>
  `sign#${userId}#${year}#${month}#${date}`;
