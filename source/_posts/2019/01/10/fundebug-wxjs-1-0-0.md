---

title: Fundebug微信小程序错误监控插件更新至1.0.0，支持配置回调函数

date: 2019-01-10 10:00:00

tags: [产品, 微信小程序]

keywords: 微信小程序

description: Fundebug微信小程序错误监控插件更新至1.0.0，支持配置回调函数

---

**摘要：** **1.0.0**新增[callback](https://docs.fundebug.com/notifier/wxjs/customize/callback.html)配置选项。

<!-- more -->

### callback(event)

callback是回调函数：

```js
fundebug.init({
    callback: function(event) {
        console.log(event);
    }
});
```

其中event为上报到Fundebug服务器的错误数据，需要的话，您可以使用callback函数来查看错误数据，也可以将其发送到其他数据平台。

### 参考

- [Fundebug文档 - callback](https://docs.fundebug.com/notifier/wxjs/customize/callback.html)




