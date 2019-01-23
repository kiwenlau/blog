---

title: Fundebug发布Vue插件，简化BUG监控接入代码

date: 2019-01-17 10:00:00

tags: [产品, Vue]

keywords: Vue, Javascript, fundebug-vue

description: Fundebug发布Vue插件，简化BUG监控接入代码

---

**摘要：** 代码越短越好！

<!-- more -->

我们发布了[fundebug-vue](https://www.npmjs.com/package/fundebug-vue)插件，可以简化Vue框架接入[Fundebug](https://www.fundebug.com/)的代码。

### Vue如何接入Fundebug

**1. 安装[fundebug-javascript](https://www.npmjs.com/package/fundebug-javascript)与[fundebug-vue](https://www.npmjs.com/package/fundebug-vue)**

```bash
npm install fundebug-javascript fundebug-vue --save
```

**2. 配置**

```javascript
import * as fundebug from "fundebug-javascript";
import fundebugVue from "fundebug-vue";
fundebug.apikey = "YOUR-APIKEY";
fundebugVue(fundebug, Vue);
```

其中，获取**apikey**需要[免费注册](https://fundebug.com/team/create)帐号并且[创建项目](https://fundebug.com/project/create)。

### 关于[fundebug-vue](https://www.npmjs.com/package/fundebug-vue)

[fundebug-vue](https://www.npmjs.com/package/fundebug-vue)非常简单，只是配置了Vue的[errorHandler](https://cn.vuejs.org/v2/api/#errorHandler)，源码只有40行，但是它可以简化Vue框架接入[Fundebug](https://www.fundebug.com/)的代码。相比于直接配置errorHandler，使用fundebug-vue可以**节省38行代码**！

另外，由于Fundebug需要支持各种前端框架，因此为每一个框架开发独立的插件便于维护，也可以减少fundebug-javascript插件的大小。后续，我们会继续发布其他前端框架比如React与Angular的对应插件。

### 参考

- [Fundebug文档：监控Vue.js](https://docs.fundebug.com/notifier/javascript/framework/vuejs.html)









