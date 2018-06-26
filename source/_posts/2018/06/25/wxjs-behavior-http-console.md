---

title: Fundebug：微信小程序用户行为添加HTTP请求和console打印

date: 2018-06-25 10:00:00

tags: [小程序, Fundebug]

keywords: 微信小程序, 小程序, 错误监控, Fundebug

description: Fundebug的微信小程序错误监控插件用户行为中新增HTTP请求和console打印。

---

**摘要：** Fundebug的微信小程序错误监控插件更新至[0.6.1](https://wxjs.fundebug.cn/fundebug.0.6.1.min.js)，用户行为中新增**HTTP请求**和**console打印**。

<!-- more -->

<div style="text-align: center;">
<img style="width:70%;" src="https://blog.fundebug.com/2018/06/25/wxjs-behavior-http-console/upgrade.png" />
</div>


### 接入插件

[接入](https://docs.fundebug.com/notifier/wxjs/integration/index.html)Fundebug的小程序错误监控插件非常简单，只需要下载[0.6.1](https://wxjs.fundebug.cn/fundebug.0.6.1.min.js)，在app.js中引入并配置apikey:

```javascript
var fundebug = require('./libs/fundebug.0.6.1.min.js')
fundebug.init({
  apikey: "API-KEY"
});
```

获取apikey需要[免费注册](https://www.fundebug.com/team/create)帐号并且[创建项目](https://www.fundebug.com/project/create)。创建项目时语言请选择“微信小程序”。

另外，还需要将https://fundebug.net添加到request合法域名。


### 用户行为

目前，Fundebug一共监控3种小程序用户行为：

- 函数调用
- HTTP请求
- console打印

如下图所示：

<div style="text-align: center;">
<img style="width:90%;" src="https://blog.fundebug.com/2018/06/25/wxjs-behavior-http-console/behavior.png" />
</div>

通过分析出错之前的用户行为，开发者阔以快速复现出错场景，并找到出错原因，从而解决错误。


### [monitorHttpData](https://docs.fundebug.com/notifier/wxjs/customize/monitorhttpdata.html)：获取HTTP请求的data

出于保护隐私，Fundebug在监控HTTP请求时，不会收集请求的body(即wx.request的data参数)。

如何你希望收集HTTP请求错误的body的话，请将monitorHttpData属性设为true。

```javascript
fundebug.init({
  monitorHttpData: true
});
```

这样，用户行为**HTTP请求**将包含请求的body，方便开发者分析BUG。

### [silentHttp](https://docs.fundebug.com/notifier/wxjs/customize/silenthttp.html)：禁用HTTP请求监控

如果你不希望监控HTTP请求的话，可以将silentHttp属性设为true:

```javascript
fundebug.init({
  silentHttp: true
});
```

这样，用户行为中将不会包含**HTTP请求**。


### [silentInject](https://docs.fundebug.com/notifier/wxjs/customize/silentinject.html)：禁止重写App/Page和wx变量

当使用小程序插件(例如[微信同声传译](https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=0004aa70d609e099c1d671b2a56009))时，重写App/Page/wx等全局变量被微信禁止(调试基础库2.0.9及以上版本)：

```
[non-writable] write wx is not allowed when using plugins at app.json.
[non-writable] write App is not allowed when using plugins at app.json.
[non-writable] write Page is not allowed when using plugins at app.json.
```

这时，需要将**silentInject**设为true。

```js
fundebug.init(
{
    silentInject : true
})
```
并使用[notifyError](../api/notifyerror.md)上报onError捕获的错误：

```js
App(
{
    onError: function(err)
    {
        fundebug.notifyError(err);
    }
})
```

禁止重写App/Page和wx变量之后，用户行为中将不再有**函数调用**以及**HTTP请求**。

