---
title: Fundebug后端Node.js插件更新至0.2.0，支持监控Express慢请求

date: 2019-07-30 10:00:00

tags: [产品更新, Node.js, Express]

keywords: Fundebug, Node.js, Express

description: Fundebug后端Node.js插件更新至0.2.0，支持监控Express慢请求
---

**摘要：** 性能问题也是BUG，也需要监控。

![](https://static.fundebug.cn/fundebug-nodejs-upgrade.jpg)

<!-- more -->

### Fundebug后端Node.js异常监控服务

[Fundebug](https://www.fundebug.com/)是专业的应用异常监控平台，我们Node.js插件[fundebug-nodejs](https://www.npmjs.com/package/fundebug-nodejs)可以提供全方位的异常监控，支持[Express](https://docs.fundebug.com/notifier/nodejs/framework/express.html)、[Koa](https://docs.fundebug.com/notifier/nodejs/framework/koa.html)以及[Hapi](https://docs.fundebug.com/notifier/nodejs/framework/hapi.html)框架。

从用户的角度理解，性能问题某种程度上也是BUG，它可能是数据库的索引问题，可能是代码算法问题，也可能是业务逻辑的设计有问题。为了帮助大家快速定位性能BUG，fundebug-nodejs插件更新至0.2.0，支持监控Express慢请求。

不过，Fundebug暂时无意于提供全面的性能监控服务，我们将继续专注于BUG监控。

### 监控Express慢请求

监控Express慢请求，需要配置阈值[httpTimeout](https://docs.fundebug.com/notifier/nodejs/customize/httptimeout.html)，并且添加ExpressTimeoutHandler中间件。

```js
fundebug.httpTimeout = 1000;
app.use(fundebug.ExpressTimeoutHandler());
```

注意，Fundebug的慢请求监控中间件**ExpressTimeoutHandler**必须放在其他中间件之前。

这样，所有花费时间超过阈值1000ms的请求都会上报到Fundebug。

### [fundebug-express-demo](https://github.com/Fundebug/fundebug-express-demo)

关于Express如何接入Fundebug异常监控服务，不妨查看我们的Demo项目[fundebug-express-demo](https://github.com/Fundebug/fundebug-express-demo)。

```javascript
const express = require("express");
const app = express();
const port = 5000;
const Promise = require("bluebird");

const fundebug = require("fundebug-nodejs");
fundebug.apikey = "APIKEY";
fundebug.httpTimeout = 1000;

app.use(fundebug.ExpressTimeoutHandler());

app.get("/error", () => {
    throw new Error("test");
});

app.get("/timeout", async (req, res) => {
    await Promise.delay(1500);
    res.sendStatus(200);
});

app.use(function(err, req, res, next) {
    res.status(500);
    next(err);
});

app.use(fundebug.ExpressErrorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

其中，**ExpressTimeoutHandler**必须放在其他中间件之前，而**ExpressErrorHandler**必须放在其他中间件之后。

Fundebug所捕获的超时请求如下：

![](https://image.fundebug.com/2019-07-30-express-timeout.png)


### 参考

- [Fundebug文档 - 监控Express](https://docs.fundebug.com/notifier/nodejs/framework/express.html)
- [Fundebug文档 - httpTimeout](https://docs.fundebug.com/notifier/nodejs/customize/httptimeout.html)
