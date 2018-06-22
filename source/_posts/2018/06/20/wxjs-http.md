---

title: Fundebug支持监控微信小程序HTTP请求错误

date: 2018-06-20 10:00:00

tags: [小程序, Fundebug]

keywords: Fundebug, 微信小程序, 小程序, 错误监控

description: Fundebug支持监控微信小程序HTTP请求错误。

---

**摘要：** Fundebug的微信小程序错误监控插件更新至[0.5.0](https://wxjs.fundebug.cn/fundebug.0.5.0.min.js)，支持监控HTTP请求错误。

<!-- more -->

<div style="text-align: center;">
<img style="width:80%;" src="https://blog.fundebug.com/2018/06/20/wxjs-http/upgrade.png" />
</div>

### 接入插件

[接入](https://docs.fundebug.com/notifier/wxjs/integration/)Fundebug的错误监控插件非常简单，只需要下载[fundebug.0.5.0.min.js](https://wxjs.fundebug.cn/fundebug.0.5.0.min.js)，在app.js中引入并配置apikey:

```javascript
var fundebug = require('./libs/fundebug.0.5.0.min.js')
fundebug.apikey = "API-KEY";
```

获取apikey需要[免费注册](https://www.fundebug.com/team/create)帐号并且[创建项目](https://www.fundebug.com/project/create)。创建项目时语言请选择“微信小程序”。

另外，还需要将https://fundebug.com添加到request合法域名。


### 监控HTTP请求错误

在小程序中，使用[wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html)发起HTTP请求。

以下两种情况我们将其视为HTTP请求错误：
- 请求返回的statusCode不是2xx时
- fail回调函数被触发

当错误发生时, Fundebug插件会将错误信息发送到后台服务器，并通知开发者。开发者登陆Fundebug网站，就可以查看到这样的错误信息：

<div style="text-align: center;">
<img style="width:80%;" src="https://blog.fundebug.com/2018/06/20/wxjs-http/01.png" />
</div>

通过分析报错信息，开发者可以及时修复BUG，避免影响更多用户。

### [filters](https://docs.fundebug.com/notifier/wxjs/customize/filters.html)：过滤不需要收集的错误

通过配置filters属性，用户可以过滤掉一些不需要捕获的错误，例如：

```javascript
fundebug.filters = [
{
    req:
    {
        url: /example\.com/,
        method: /^GET$/
    }
}];
```

这样，Fundebug插件将不会监控发送到example.com的GET请求错误。

### [monitorHttpData](https://docs.fundebug.com/notifier/wxjs/customize/monitorhttpdata.html)：获取请求的data

出于保护隐私，Fundebug在监控HTTP请求错误时，不会收集请求的body(即wx.request的data参数)。

如何你希望收集HTTP请求错误的body的话，请将monitorHttpData属性设为true。

```javascript
fundebug.monitorHttpData = true;
```

### [silentHttp](https://docs.fundebug.com/notifier/wxjs/customize/silenthttp.html)：禁用HTTP请求监控

如果你不希望监控HTTP请求错误的话，可以将silentHttp属性设为true:

```javascript
fundebug.silentHttp = true;
```

