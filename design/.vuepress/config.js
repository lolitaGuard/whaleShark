module.exports = {
  dest: "./dist",
  title: "有颜在先",
  description: "文档...",
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#"
    },
    toc: {
      includeLevel: [2, 3]
    }
  },

  themeConfig: {
    repo: "https://github.com/lolitaGuard/whaleShark",
    nav: [
      {
        text: "前言",
        link: "/"
      },
      {
        text: "文档",
        link: "/api/common.md"
      }
    ],
    sidebar: [
      "/",
      "/api/token",
      "/api/home",
      "/api/daily",
      "/api/invite",
      "/api/user",
      "/api/user-follow",
      "/api/user-fav",
      "/api/sign"
      // '/api/error',
    ],
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated"
  }
};
