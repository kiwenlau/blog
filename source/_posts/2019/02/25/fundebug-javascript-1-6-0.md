---
title: Fundebug前端JavaScript插件更新至1.6.0，新增test()方法用于测试

date: 2019-02-25 10:00:00

tags: [产品, JavaScript]

keywords: VS Code

description: Fundebug前端JavaScript插件更新至1.6.0，新增test()方法用于测试
---

**摘要：** 1.6.0 新增 fundebug.test()方法用于测试，请大家及时更新。

<!-- more -->

![](https://image.fundebug.com/2019-02-25-1.6.0.jpg)

默认情况下，Fundebug 插件能够自动捕获未处理的错误(uncaught error)。另外，开发者也可以通过使用 Fundebug 提供的 API 发送其他错误信息:

-   [fundebug.test()](https://docs.fundebug.com/notifier/javascript/api/test.html)
-   [fundebug.notify()](https://docs.fundebug.com/notifier/javascript/api/notify.html)
-   [fundebug.notifyError()](https://docs.fundebug.com/notifier/javascript/api/notifyerror.html)

### fundebug.test(name, message)

使用 test() 方法，可以将测试数据发送到 Fundebug

**name**: 测试名称，参数类型为字符串，默认值为"Test"

**message**: 测试信息，参数类型为字符串, 默认值为"Hello, Fundebug!"

示例：

-   不设置 name 与 message

```js
if ("fundebug" in window) {
    fundebug.test();
}
```

-   设置 name 与 message

```js
if ("fundebug" in window) {
    fundebug.test("Test", "Hello, Fundebug!");
}
```

### 报警规则

test()方法用于测试，它发送的数据每次都会发送报警，每天报警次数限额为 20 次。

为了避免重复报警，请使用[notifyError()](./notifyerror.md)或者[notify()](./notify.md)记录错误，按照默认的报警规则，同一个错误将只会在错误数达到阈值(10, 100, 100...)的时候报警。

### 参考

-   [Fundebug 文档 - JavaScript 插件版本](https://docs.fundebug.com/notifier/javascript/version.html)
-   [Fundebug 文档 - fundebug.test()](https://docs.fundebug.com/notifier/javascript/api/test.html)
-   [黑科技！Fundebug 支持可视化重现出错场景](https://blog.fundebug.com/2018/05/21/fundebug_release_black_tech_replay/)
-   [Fundebug 发布 Vue 插件，简化 BUG 监控接入代码](https://blog.fundebug.com/2019/01/17/release-fundebug-vue/)
