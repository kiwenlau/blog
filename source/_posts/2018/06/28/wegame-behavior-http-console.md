---

title: Fundebug：微信小游戏支持监控用户行为

date: 2018-06-28 10:00:00

tags: [Fundebug, 小游戏]

keywords: 微信小游戏, 错误监控, Fundebug

description: Fundebug的微信小游戏错误监控插件支持监控用户行为，包括HTTP请求和console打印

---

**摘要：** Fundebug的微信小游戏错误监控插件更新至[0.3.0](https://wegame.fundebug.cn/fundebug.0.3.0.min.js)，用户行为中新增**HTTP请求**和**console打印**。

<!-- more -->


### 接入插件

[接入](https://docs.fundebug.com/notifier/wegame/integration.html)Fundebug的小游戏错误监控插件非常简单，只需要下载[0.3.0](https://wegame.fundebug.cn/fundebug.0.3.0.min.js)，在app.js中引入并配置apikey:

```javascript
var fundebug = require('./libs/fundebug.0.3.1.min.js')
fundebug.init({
  apikey: "API-KEY"
});
```

获取apikey需要[免费注册](https://www.fundebug.com/team/create)帐号并且[创建项目](https://www.fundebug.com/project/create)。创建项目时语言请选择“微信小游戏”。

另外，还需要将**https://wegame.fundebug.net**添加到request合法域名。


### 用户行为

目前，Fundebug一共监控2种小游戏用户行为：

- HTTP请求
- console打印

如下图所示：


<div style="text-align: center;">
<img style="width:90%;" src="https://blog.fundebug.com/2018/06/28/wegame-behavior-http-console/error.png" />
</div>

通过分析出错之前的用户行为，开发者阔以快速复现出错场景，并找到出错原因，从而解决错误。


### [monitorHttpData](https://docs.fundebug.com/notifier/wegame/customize/monitorhttpdata.html)：获取HTTP请求的data

出于保护隐私，Fundebug在监控HTTP请求时，不会收集请求的body(即wx.request的data参数)。

如何你希望收集HTTP请求错误的body的话，请将monitorHttpData属性设为true。

```javascript
fundebug.init({
  monitorHttpData: true
});
```

这样，用户行为**HTTP请求**将包含请求的body，方便开发者分析BUG。

### [silentHttp](https://docs.fundebug.com/notifier/wegame/customize/silenthttp.html)：禁用HTTP请求监控

如果你不希望监控HTTP请求的话，可以将silentHttp属性设为true:

```javascript
fundebug.init({
  silentHttp: true
});
```

这样，用户行为中将不会包含**HTTP请求**。
