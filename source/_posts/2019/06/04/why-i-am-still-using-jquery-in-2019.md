---
title: 2019 年了，为什么我还在用 jQuery？

date: 2019-06-04 10:00:00

tags: [jQuery]

keywords: jQuery

description: 2019 年了，为什么我还在用 jQuery？
---

**译者按：** 看来 jQuery 还是有一些用武之地的。

<!-- more -->

-   原文: [Why I'm Still Using jQuery in 2019](https://arp242.net/)
-   译者: [Fundebug](https://www.fundebug.com/)

**为了保证可读性，本文采用意译而非直译。翻译仅供学习探讨，不代表 Fundebug 观点。**

许多人都在提倡: “直接用原生的 JavaScript 就好了，不需要 jQuery 了”。

[You might not need jQuery](http://youmightnotneedjquery.com/)尝试告诉我们，摆脱 jQuery 是一件很容易的事情。但是，它的第一个例子恰恰告诉我们用 jQuery 其实也不错，因为我们写了 10 行原生的 JavaScript 代码，其实只需要 1 行 jQuery 代码就够了。

![](https://image.fundebug.com/2019-06-01-jquery-vs-native-javascript.png)

很多 JavaScript 的 API，尤其是 DOM 相关的 API，挑战了我的审美哲学，直白点说，我觉得它们太糟糕了！`el.insertAdjacentElement('afterend', other)`当然也可以用，但是`$(el).after(other)`更加简洁。`$()`函数也没那么好看，我没有特别喜欢，但是它比原生的 API 好太多了。

你们如何获取某个元素的 sibling 呢？到底用`nextSibling`还是用`nextElementSibling`？它们有什么不同？各个浏览器分别支持哪个方法？当你忙着去 MDN 查文档的时候，我直接用 jQuery 的`next`和`prev()`就好了。

许多常用的 JavaScript 的标准 API 都挺奇怪的，这里我就不列出来了，大家去[You might not need jQuery](http://youmightnotneedjquery.com/)看看就知道了。

写代码的时候，我们总会需要使用一些常用的帮助函数，[You might not need jQuery](http://youmightnotneedjquery.com/)列举了很多，使用 jQuery 可以很方便的使用这些帮助函数，这样我们就不需要每次都去 Stack OverFlow 上去复制代码了。。。

浏览器的兼容问题已经没有以前那么头疼了，但是它还是个不小的问题，除非你觉得只要 85%的用户 OK 就行。关于这个问题，大家可以阅读我的[Why Hello CSS doesn’t use CSS variables](https://arp242.net/css-vars.html)。

那么，我们必须使用 jQuery 吗？当然不是！使用任何第三方库都是有代价的，增加了复杂度，也增加了文件大小。但是，jQuery 其实没那么大，压缩之后的大小只有 30K。如果我们去掉 ajax 以及一些不常用的功能的话，就只有 23K；如果我们使用 querySelector 替代 SizzleJS 来构建的话，则只有 17K 了。无论是 30K 还是 17K，对许多应用来说，这个大小都是完全可以接受的。

大家不妨看看[Bootstrap removing jQuery](https://github.com/twbs/bootstrap/pull/23586)，为了移除 jQuery，他们也是花了不少精力啊：自己撸帮助函数；放弃兼容 IE，因为太难写了；他们花了 1 年半时间来倒腾这个。最终的结果在我看来，这些努力似乎不值得。

我理解他们为什么这么做，大家希望在 Vue 项目中使用 Bootstrap，但是同时使用 Vue 和 jQuery 的话有点傻。对于减少网页大小，我非常同意，也很喜欢[Web bloat](http://danluu.com/web-bloat/)与[The Ethics of Web Performance](https://timkadlec.com/remembers/2019-01-09-the-ethics-of-performance/)两篇博客中的观点。但是，我们需要实际一点，不要过于理想主义。添加 17K 的 jQuery 真的那么糟糕吗？当我吐槽 Medium 或者 New York Times 这样的网站需要的 JS 文件超过 1M 的时候，有的人会这样反驳：”莫非你还在用 56k 的带宽？“，但是，为什么 17K 的 jQuery 就那么不能接受了呢？

不用 jQuery 而自己写帮助函数也可以，比如你希望你写的函数被其他人复用，或者你写的函数特别小。但是为了不用 jQuery，放弃向后兼容？那我觉得还是用 jQuery 得了。**所有事情都用 jQuery 实现**当然不好，但是**任何时候都不用 jQuery**也不是什么明智之举。

我不是 jQuery 的狂热粉丝，我也愿意使用一些**简化版的 jQuery**，只要它们可以让 JS 的 API 更好用一点。[You might not need jQuery](http://youmightnotneedjquery.com/)推荐了[bonzo](https://github.com/ded/bonzo)和[\$dom](https://github.com/julienw/dollardom)，以及其他一些 AJAX 库，但是大多数看起来没怎么维护。如果没有足够吸引人的理由，最好不要去替代 jQuery，因为 jQuery 本身没什么大毛病。

有些读者也许会去比较 Vue, React 以及其他前端框架，但是这篇博客的目的是比较 jQuery 与原生的 JavaScript，没有打算去论证整个前端到底应该如何开发。

话说回来，我觉得有些场景下只使用简单的 JavaScript 也挺好的，主要原因是我希望网页可以足够快，可以让尽量多的人正常访问。以我的经验，使用服务端渲染，再加上渐进式增强 JavaScript，是最佳的实现方式，开发起来很简单，访问速度足够快，BUG 也很少。

难道前端框架不好吗？当然不是，没有什么绝对不好的技术，所有技术都有一定的取舍，当然也包括 jQuery。

### 参考

-   [GitHub：我们是这样弃用 jQuery 的](https://blog.fundebug.com/2018/11/23/removing-jquery-from-github-frontend/)
-   [为啥 jQuery 被淘汰了？](https://blog.fundebug.com/2018/11/21/why-does-jquery-fell-behind/)
-   [为什么越来越少的人用 jQuery](https://blog.fundebug.com/2018/12/05/why-does-not-we-use-jquery/)
