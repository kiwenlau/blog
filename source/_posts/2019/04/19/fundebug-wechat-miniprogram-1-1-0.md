---
title: Fundebug微信小程序BUG监控插件更新至1.1.0，新增test()与notifyHttpError()方法

date: 2019-04-19 10:00:00

tags: [Fundebug, 小程序]

keywords: 小程序, 小程序错误监控, 小程序异常监控, 小程序BUG监控

description: Fundebug微信小程序BUG监控插件更新至1.1.0，新增test()与notifyHttpError()方法
---

**摘要：** **1.1.0**新增[fundebug.test()](https://docs.fundebug.com/notifier/wxjs/api/test.html)和[fundebug.notifyHttpError()](https://docs.fundebug.com/notifier/wxjs/api/notifyhttperror.html)方法，同时大小压缩至**15K**。

![](https://image.fundebug.com/2019-0422-wxjs_update.jpg)

<!-- more -->

[Fundebug](https://www.fundebug.com/)是专业的小程序BUG监控服务，可以第一时间为您捕获生存环境中小程序的异常、错误或者BUG，及时给开发者发送报警，帮助您快速修复BUG。欢迎大家免费试用，也欢迎各位用户反馈建议或者问题。

### test(name, message)

使用 fundebug.test()方法可以用于测试 Fundebug 插件。

**name**: 错误名称，参数类型为字符串，默认值为"Test"

**message**: 错误信息，参数类型为字符串，默认值为"Hello, Fundebug!"

示例 1 ： 没有参数

```js
fundebug.test();
```

示例 2 ： 带参数

```js
fundebug.test("Hello", "This is a Test");
```

fundebug.test() 主要用于测试，它发送的错误每次都会报警邮件（每天的限额是 20 封），这样可能会给您造成困扰。为了避免重复报警，请使用其他 API 记录错误，这样同一个错误将只会在错误数达到阈值(10, 100, 100...)的时候报警。

-   [notify](https://docs.fundebug.com/notifier/wxjs/api/notify.html)
-   [notifyError](https://docs.fundebug.com/notifier/wxjs/api/notifyerror.html)
-   [notifyHttpError](https://docs.fundebug.com/notifier/wxjs/api/notifyhttperror.html)

### notifyHttpError(req, res, option)

使用 notifyHttpError，可以将 HTTP 请求错误发送到 Fundebug。

**req**: HTTP 请求参数，参数类型为 Object，其子属性与[wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)的请求参数一致，如下：

-   method
-   url
-   data
-   header
-   dataType
-   responseType

**res**: HTTP 返回参数，参数类型为 Object，其子属性与[wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)的返回参数一致，如下：

-   statusCode
-   errMsg
-   data
-   header

**option**: 可选对象，参数类型为 Object，用于发送一些额外信息，比如:

-   metaData: 其他自定义信息

示例：

```js
wx.request({
    method: "POST",
    url: "https://example.com/create",
    data: {
        test: "test"
    },
    success(res) {
        fundebug.notifyHttpError(
            {
                method: "POST",
                url: "https://example.com/create"
            },
            res
        );
    },
    fail(res) {
        fundebug.notifyHttpError(
            {
                method: "POST",
                url: "https://example.com/create"
            },
            res
        );
    }
});
```

最后，感谢 Fundebug 用户**无事忙**的反馈。

### 参考

- [Fundebug文档 - fundebug.test()](https://docs.fundebug.com/notifier/wxjs/api/test.html)
- [Fundebug文档 - fundebug.notifyHttpError()](https://docs.fundebug.com/notifier/wxjs/api/notifyhttperror.html)

