---
title: Fundebug支付宝小程序BUG监控插件更新至0.2.0，新增test()方法，报错增加Page数据

date: 2019-04-25 10:00:00

tags: [小程序]

keywords: 支付宝小程序, 小程序, 支付宝, BUG监控

description: Fundebug支付宝小程序BUG监控插件更新至0.2.0，新增test()方法，报错增加Page数据
---

**摘要：** **0.2.0**新增[fundebug.test()](https://docs.fundebug.com/notifier/aliapp/api/test.html)方法，同时报错增加了Page数据。

![](https://image.fundebug.com/alipay_miniprogram_upgrade.jpg)

<!-- more -->

[Fundebug](https://www.fundebug.com/)提供专业支付宝小程序BUG监控服务，可以第一时间为您捕获生存环境中小程序的异常、错误或者BUG，及时给开发者发送报警，帮助您快速修复BUG。欢迎大家免费试用，也欢迎各位用户反馈建议或者问题。

### test(name, message)

[fundebug.test()](https://docs.fundebug.com/notifier/aliapp/api/test.html)用于测试，可以将测试数据发送到Fundebug，并收到报警邮件。

- **name**: 错误名称，参数类型为字符串，默认值为"Test"
- **message**: 错误信息，参数类型为字符串，默认值为"Hello, Fundebug!"

示例：

```js
fundebug.test()
```

```js
fundebug.test("Test", "Hello, Fundebug!")
```

fundebug.test() 主要用于测试，它发送的错误每次都会报警邮件（每天的限额是 20 封），这样可能会给您造成困扰。为了避免重复报警，请使用其他 API 记录错误，这样同一个错误将只会在错误数达到阈值(10, 100, 100...)的时候报警。

- [notify](https://docs.fundebug.com/notifier/aliapp/api/notify.html)
- [notifyError](https://docs.fundebug.com/notifier/aliapp/api/notifyerror.html)

### Page

Fundebug插件会调用getCurrentPages方法获取报错页面的Page数据，与错误数据一起上报：

```javascript
{
    "route": "pages/index/index",
    "_viewId": "1556021552987",
    "data": {
        "title": "Alipay"
    }
}
```

如果不需要收集Page数据的话，可以将[silentPage](https://docs.fundebug.com/notifier/aliapp/customize/silentpage.html)属性设为true:

```javascript
fundebug.init(
{
    silentPage : true
})
```

最后，感谢 Fundebug 用户**闵胖胖**的反馈。

### 参考

- [Fundebug文档 - fundebug.test()](https://docs.fundebug.com/notifier/aliapp/api/notify.html)
- [Fundebug文档 - silentPage](https://docs.fundebug.com/notifier/aliapp/customize/silentpage.html)