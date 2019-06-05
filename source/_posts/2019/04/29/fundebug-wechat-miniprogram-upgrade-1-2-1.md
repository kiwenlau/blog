---
title: Fundebug 微信小程 BUG 监控插件更新至 1.2.1，优化错误上报次数的限制算法，新增 silentHttpHeader 配置选项

date: 2019-04-29 10:00:00

tags: [小程序]

keywords: 微信小程序, 小程序

description: Fundebug 微信小程 BUG 监控插件更新至 1.2.1，优化错误上报次数的限制算法，新增 silentHttpHeader 配置选项
---

**摘要：** **1.2.1**优化错误上报次数的限制算法，新增[silentHttpHeader](https://docs.fundebug.com/notifier/wxjs/customize/silenthttpheader.html)配置选项，请大家及时更新哈！

![](https://image.fundebug.com/2019-0422-wxjs_update.jpg)

<!-- more -->

[Fundebug](https://www.fundebug.com/)提供专业的微信小程序 BUG 监控服务，可以第一时间为您捕获生存环境中小程序的异常、错误或者 BUG，及时给开发者发送报警，帮助您快速修复 BUG。欢迎大家免费试用，也欢迎各位用户反馈建议或者问题。

### 优化错误上报次数的限制算法

在小程序生命周期之内，Fundebug 最多错误上报次数为 50 次，这是为了避免无限循环导致无限报错。这里所说的生命周期，指的是小程序仍然存在于内存里面。

根据微信小程序的[文档](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)，[wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)的最大并发限制是  10  个。因此，Fundebug 同一时间上报的错误数最多为 5 个，这是为了避免占用微信小程序的网络请求的并发数。

### [silentHttpHeader](https://docs.fundebug.com/notifier/wxjs/customize/silenthttpheader.html)

如果你不希望监控 HTTP 请求错误的 Header 的话，可以将 silentHttpHeader 属性设为 true:

```js
fundebug.init({
    silentHttpHeader: true
});
```

最后，感谢 Fundebug 用户**熊文**的反馈。

### 参考

-   [Fundebug 文档 - silentHttpHeader](https://docs.fundebug.com/notifier/wxjs/customize/silenthttpheader.html)
-   [微信小程序文档 - 网络](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)
