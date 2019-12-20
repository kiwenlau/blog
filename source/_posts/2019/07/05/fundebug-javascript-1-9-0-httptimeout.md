---
title: Fundebug前端异常监控插件更新至 1.9.0，支持监控 HTTP 慢请求

date: 2019-07-05 10:00:00

tags: [JavaScript, fundebug-javascript]

keywords: JavaScript, fundebug-javascript, 异常监控, 监控慢请求

description: Fundebug前端异常监控插件更新至 1.9.0，支持监控 HTTP 慢请求
---

**摘要：** **1.9.0**新增 [httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html) 配置选项，支持监控 HTTP 慢请求，同时修复了记录的 HTTP 响应时间偏小的 BUG。

<!-- more -->

![](https://image.fundebug.com/2019-06-03-fundebug-javascript-upgrade.jpg)

[Fundebug](https://www.fundebug.com/)提供专业的前端异常监控服务，可以第一时间捕获线上环境中小程序的异常、错误或者 BUG，及时给开发者推送报警，帮助您快速修复 BUG。

[Fundebug](https://www.fundebug.com/)的前端异常监控插件更新至**1.9.0**，新增[httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html)配置选项，支持监控 HTTP 慢请求，同时修复了记录的 HTTP 响应时间偏小的 BUG，请大家及时更新！

### 监控 HTTP 慢请求

Fundebug 专注于程序异常监控，暂时无意于提供全面的性能监控服务。但是，当 HTTP 请求过慢，导致用户体验很糟糕时，也可以理解为一种广义的 BUG。HTTP 请求的性能问题，可能是代码的算法不够好导致的，可能是业务逻辑有问题，可能是应用架构不合理，有可能是数据库的索引不合理导致的，还有可能是其他原因，这些都是技术层面的”BUG“，需要开发者及时处理。

当然，监控所有 HTTP 请求的响应时间不是我们 Fundebug 需要做的事情，因此我们只支持监控慢请求。用户只需要配置一个阈值[httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html)，所有响应时间超过阈值的 HTTP 请求都会上报的 Fundebug，这样可以帮助开发者发现一些慢请求，及时优化性能。

互联网由粗放式发展逐渐转向精细化发展，这也要求开发者对线上应用进行更加严格的监控，尽量优化性能、减少BUG，这也才能提高产品质量，赢得客户的信任，欢迎大家[免费试用](https://www.fundebug.com/team/create)Fundebug的前端异常监控服务。

### httpTimeout

监控 HTTP 慢请求的正确方式是通过 Fundebug 的配置选项[httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html)来实现。

httpTimeout 类型为 Number，单位为毫秒(ms)。

如果你希望监控较慢的 HTTP 请求，则可以通过[httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html)配置阈值，比如 1000：

```js
if ("fundebug" in window) {
    fundebug.httpTimeout = 1000;
}
```

则所有响应时间超过 1000ms 的请求都会上报到 Fundebug。

例如，Fundebug[上传Source Map](https://docs.fundebug.com/notifier/javascript/sourcemap/upload/)的接口比较慢，这是因为source map文件太大导致的，这个问题也需要进一步优化，比如可以在前端压缩source map文件之后再上传。

![](https://image.fundebug.com/2019-07-05-source-map-httptimeout.png)

最后，感谢 Fundebug 用户**yaoqi**的反馈。

### 参考

-   [Fundebug 文档 - httpTimeout](https://docs.fundebug.com/notifier/javascript/customize/httptimeout.html)
