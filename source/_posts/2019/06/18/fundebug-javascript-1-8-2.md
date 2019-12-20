---
title: Fundebug前端JavaScript插件更新至1.8.2，修复2个小BUG

date: 2019-06-18 10:00:00

tags: [JavaScript, Fundebug]

keywords: JavaScript, Fundebug, 异常监控, BUG监控, 崩溃监控, 错误监控

description: Fundebug前端JavaScript插件更新至1.8.2，修复2个小BUG
---

**摘要：** 修复2个BUG，请大家及时更新。

![](https://image.fundebug.com/2019-06-03-fundebug-javascript-upgrade.jpg)

<!-- more -->

### Fundebug前端异常监控服务

[Fundebug](https://www.fundebug.com/)是专业的程序异常监控平台，我们JavaScript插件可以提供全方位的异常监控，可以帮助开发者第一时间定位各种前端异常，包括：

- [JavaScript执行错误](https://docs.fundebug.com/notifier/javascript/type/javascript.html)
- [资源加载错误](https://docs.fundebug.com/notifier/javascript/type/resource.html)
- [HTTP请求错误](https://docs.fundebug.com/notifier/javascript/type/http.html)
- [unhandledrejection](https://docs.fundebug.com/notifier/javascript/type/unhandledrejection.html)
- [WebSockect连接错误](https://docs.fundebug.com/notifier/javascript/type/websocket.html)

并且，我们可以记录用户行为、“录制”用户操作视频，帮助开发者快速复现BUG，提高Debug效率。

Fundebug前端异常监控插件更新至1.8.2，修复了2个小BUG：

- 修复用户行为中重复记录HTTP请求的BUG
- 修复Websocket的onerror为undefined报错的BUG

这2个BUG都不会影响Fundebug功能，不过为了避免造成困扰，请大家及时更新插件。

### 修复用户行为中重复记录HTTP请求的BUG

根据用户反馈，Fundebug插件有时会在[用户行为](https://blog.fundebug.com/2017/09/14/fundebug-can-recurrent-all-bug/)中某些HTTP请求：

![](https://image.fundebug.com/2019-06-18-duplicate_http.png)

这个问题的根本原因应该是[浏览器的BUG](https://bugs.chromium.org/p/chromium/issues/detail?id=162837)导致的，我们通过对插件代码进行修改规避了这个问题。

这个BUG不会影响Fundebug的功能，不过为了避免造成困扰，请大家及时更新插件。

### 修复Websocket的onerror为undefined报错的BUG

根据用户反馈，当我们将Websocket的onerror设为undefined时，会导致Fundebug插件报错：

```javascript
var ws = new WebSocket("wss://ap.fundebug.com/api/events/count");
ws.onerror = undefined;
```

报错信息为：”TypeError: null is not an object (evaluating 'n.apply')“。我们优化了监控WebSocket连接错误的代码，可以避免这个报错。

这个BUG不会影响Fundebug的功能，不过为了避免造成困扰，请大家及时更新插件。

最后，感谢Fundebug用户**暗元素**的反馈与协助。

### 参考

- [Fundebug前端JavaScript插件更新至1.2.0，支持监控WebSocket连接错误](https://blog.fundebug.com/2018/08/21/fundebug-javascript-1-2-0/)
- [没有Fundebug不能复现的BUG](https://blog.fundebug.com/2017/09/14/fundebug-can-recurrent-all-bug/)
- [Fundebug录屏插件更新至0.4.0，修复BUG，优化性能](https://blog.fundebug.com/2019/05/26/fundebug-release-revideo-0-4-0/)
- [Fundebug文档 - JavaScript插件版本](https://docs.fundebug.com/notifier/javascript/version.html)









