---
title: Fundebug 微信小程序 BUG 监控插件更新至 1.3.1，新增 httpTimeout 配置选项，支持监控 HTTP 慢请求

date: 2019-06-12 10:00:00

tags: [小程序, Fundebug]

keywords: Fundebug, 微信小程序, BUG监控, 性能监控, HTTP慢请求

description: Fundebug 微信小程序 BUG 监控插件更新至 1.3.1，新增 httpTimeout 配置选项，支持监控 HTTP 慢请求
---

**摘要：** **1.3.1**新增 httpTimeout 配置选项，支持监控 HTTP 慢请求，同时修复了记录的 HTTP 响应时间偏小的 BUG。

![](https://image.fundebug.com/2019-0422-wxjs_update.jpg)

<!-- more -->

[Fundebug](https://www.fundebug.com/)是专业微信小程序 BUG 监控服务，可以第一时间捕获线上环境中小程序的异常、错误或者 BUG，及时给开发者推送报警，帮助您快速修复 BUG。

[Fundebug](https://www.fundebug.com/)的微信小程序 BUG 监控插件更新至**1.3.1**，新增[httpTimeout](https://docs.fundebug.com/notifier/wxjs/customize/httptimeout.html)配置选项，支持监控 HTTP 慢请求，同时修复了记录的 HTTP 响应时间偏小的 BUG，请大家及时更新！

### 监控 HTTP 慢请求

Fundebug 专注于 BUG 监控，暂时无意于提供全面的性能监控服务。但是，当 HTTP 请求过慢，导致用户体验很糟糕时，也可以理解为一种广义的 BUG。HTTP 请求的性能问题，可能是代码的算法不够好导致的，有可能是数据库的索引不合理导致的，还有可能是其他原因，这些都是技术层面的”BUG“，需要开发者及时处理。

当然，监控所有 HTTP 请求的响应时间不是我们 Fundebug 需要做的事情，因此我们只支持监控慢请求。用户只需要配置一个阈值[httpTimeout](https://docs.fundebug.com/notifier/wxjs/customize/httptimeout.html)，所有响应时间超过阈值的 HTTP 请求都会上报的 Fundebug，这样可以帮助开发者发现一些慢请求，及时优化性能。

### 微信小程序配置选项 networktimeout

根据微信小程序的开发文档，[网络请求](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)的默认超时时间是 60s，用户可以通过配置[networktimeout](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)来自定义。如果某个 HTTP 请求的响应时间超过这个阈值的话，则该请求会出错，Fundebug 也会上报这个超时错误。但是，networktimeout 不能配置的太低，否则超时的请求都会失败，这并不合理。所以配置 networktimeout 并不能实现监控 HTTP 慢请求的目的。

### httpTimeout

监控 HTTP 慢请求的正确方式是通过 Fundebug 的配置选项[httpTimeout](https://docs.fundebug.com/notifier/wxjs/customize/httptimeout.html)来实现。

httpTimeout 类型为 Number，单位为毫秒(ms)。

如果你希望监控较慢的 HTTP 请求，则可以通过[httpTimeout](https://docs.fundebug.com/notifier/wxjs/customize/httptimeout.html)配置阈值，比如 1000：

```js
fundebug.init({
    httpTimeout: 1000
});
```

则所有响应时间超过 1000ms 的请求都会上报到 Fundebug。

最后，感谢 Fundebug 用户**爱享到**与**阿苏**的反馈。

### 参考

-   [Fundebug 文档 - httpTimeout](https://docs.fundebug.com/notifier/wxjs/customize/httptimeout.html)
