---
title: 有浏览器的地方就有Fundebug

date: 2017-01-16 09:00:00

tags: [Fundebug, JavaScript]
---

[Fundebug](https://fundebug.com)已经全面支持主流浏览器啦！

对于前端开发者，兼容各种浏览器是一件非常痛苦的事情。在搜索框中输入关键字**JavaScript浏览器兼容**，结果是这样的:

<!-- more -->

- [IE和Firefox的Javascript兼容性总结](http://www.cnblogs.com/wiky/archive/2010/01/09/IE-and-Firefox-Javascript-compatibility.html)
- [JavaScript中浏览器兼容问题](http://www.cnblogs.com/DF-fzh/p/5408241.html)
- [JavaScript初学者建议：不要去管浏览器兼容](http://www.ituring.com.cn/article/67234)
- ...

#### 有浏览器的地方就有Fundebug

[Fundebug](https://fundebug.com)是前端JavaScript错误实时监测平台，经过大量兼容性调试，Fundebug的JavaScript监测插件已经能够在各种主流浏览器中自动捕获错误，并且可以获取最全面的错误信息，帮助开发者更快的Debug。而对于近来不怎么受待见的IE浏览器，我们也进行了全面支持，**从IE 6到IE 11**。

<div style="text-align: center;">
<img style="width:80%;" src="fundebug-support-all-browsers/browser.jpg" />
</div>

#### 为什么要兼容各种浏览器？

根据[百度统计](http://tongji.baidu.com/data/browser)的最新数据，2016年10月份到12月份国内的浏览器份额如图所示:

<div style="text-align: center;">
<img style="width:80%;" src="fundebug-support-all-browsers/browser-share.png" />
</div>

可知，用户偏好千差万别，而各版本的IE的市场份额总计为26%，仅次于Chrome。**我还有什么话可说呢？**国内主流浏览器都采用双内核机制，即兼容模式和极速模式，而所谓兼容模式，使用的是triend内核，即IE内核。

作为一个自带价值观的产品，Fundebug希望**通过兼容各种浏览器帮助开发者提升用户体验**。


#### 兼容浏览器坑在哪里？

- [Error对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)的属性各有不同，例如大名鼎鼎的Chrome的Error对象木有fileName，lineNumber以及columnNumber属性;
- [Onerror事件](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror)的参数各有不同，例如老版本的Firefox木有columnNumber 和error参数
- API不同，例如老版本的IE木有[JSON对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON);
- 同一个属性名在不同浏览器的含义不同；
- 同一个属性在不同浏览器的名称不同；
- 国内浏览器的IE兼容模式与真正的IE也略有不同;
- ......

这些问题大概前端工程师都会深有同感吧。

#### 错误智能聚合

同样的代码产生的同一个错误，在不同浏览器上的报错信息是各不相同的。name不同的错误可能是同一个错误，例如**SyntaxError**与**ReferenceError**；message不同的错误可能是同一个错误，例如**can not find variable fundebug**与**fundebug is not defined**。并且，同一个错误在不同浏览器下的lineNumber，columnNumber，stack，与url都有可能不同。

对于这个问题，我们对收集的错误利用机器学习算法进行了智能聚合，尽量将同一个错误聚合到一起，减少重复报警。根据我们的初步估算，目前聚合算法能够将**90%**的重复错误成功聚合，这样极大地提高了用户分析错误的效率。

还等什么呢？感觉免费注册[Fundebug](https://fundebug.com/team/create)吧！


<div style="background: #fff; text-align: center; height: 50px; line-height: 50px;"><a href="https://fundebug.com/team/create" style="padding: 10px 20px; background: #22A985; color: #FFF; border-radius: 3px;">立即注册 ➔</a></div>
</div>

