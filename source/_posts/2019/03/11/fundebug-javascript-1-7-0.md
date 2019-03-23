---
title: Fundebug 前端 JavaScript 插件更新至 1.7.1，拆分录屏代码，还原部分 Script error.

date: 2019-03-11 10:00:00

tags: [产品, JavaScript]

keywords: JavaScript, Script error., 录屏

description: Fundebug 前端 JavaScript 插件更新至 1.7.1，拆分录屏代码，还原部分 Script error.
---

**摘要：** BUG 监控插件压缩至 18K。

![](https://image.fundebug.com/2019-03-13-fundebug-js-171.png)

<!-- more -->

**1.7.1**拆分了录屏代码，BUG 监控插件压缩至**18K**，另外我们还原了部分 Script error，帮助用户更方便地 Debug。请大家及时更新哈~

### 拆分录屏代码

从**1.7.1**版本开始，我们拆分了录屏代码。如果需要使用录屏功能的话，需要单独接入录屏插件。

**使用 script 方式接入**

```html
<script
    type="text/javascript"
    src="https://js.fundebug.cn/fundebug.revideo.0.2.0.min.js"
></script>
```

**使用 NPM 方式接入**

```javascript
require("fundebug-revideo");
```

### 还原部分 Script error.

关于 Script error.的原理以及解法的详细介绍，请参考我们的博客:

-   [Script error.全面解析](https://blog.fundebug.com/2017/04/05/understand-script-error/)
-   [Script error.深度测试](https://blog.fundebug.com/2017/04/06/test-script-error/)
-   [Script error.解决方法](https://blog.fundebug.com/2017/04/07/solve-script-error/)

简单地说，当跨域的 JS 脚本出错时，浏览器为了安全性，只会给我们返回"Script error."，这样会对 Debug 造成很大困扰。

我们通过技术手段，成功还原了 addEventListener 回调函数中抛出的 Script error.

感兴趣的同学可以将下面这段代码放到跨域的 JS 脚本中进行测试，Fundebug 插件 1.6.0 只能获取 Script error，而 1.7.1 则可以成功获取真实的报错信息"test"。

```javascript
var btn = document.querySelector("#button");
btn.addEventListener("click", function() {
    throw new Error("test");
});
```

最后，感谢 Fundebug 用户**yaoqi**与**penyu**的反馈！

### 参考

-   [黑科技！Fundebug 支持可视化重现出错场景](https://blog.fundebug.com/2018/05/21/fundebug_release_black_tech_replay/)
-   [Fundebug 文档 - 录屏](https://docs.fundebug.com/notifier/javascript/revideo.html)
-   [Script error.全面解析](https://blog.fundebug.com/2017/04/05/understand-script-error/)
-   [Script error.深度测试](https://blog.fundebug.com/2017/04/06/test-script-error/)
-   [Script error.解决方法](https://blog.fundebug.com/2017/04/07/solve-script-error/)
