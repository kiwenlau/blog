---

title: 2018年，JavaScript都经历了什么？

date: 2018-12-25 10:00:00

tags: [JavaScript]

keywords: JavaScript, ECMAScript, Node, Vue, Babel, jQuery, V8

description: 2018年，JavaScript都经历了什么？

---


**摘要：** 对JSer来说，这是很有意思的1年。

<!-- more -->

本文灵感来自[JavaScript Weekly](https://javascriptweekly.com/)周报，欢迎大家订阅。

### The State of JavaScript 2018

[The State of JavaScript](https://2018.stateofjs.com/)调研已经连续做了3年([2016](http://2016.stateofjs.com/), [2017](https://2017.stateofjs.com/), [2018](https://2018.stateofjs.com))，[今年](https://2018.stateofjs.com/)一共调研了2万多个JS开发者。有这样一些有意思的发现：

- 绝大多数开发者都用过ES6，同时TypeScript也越来越流行了；
- React依然最流行的前端框架，同时Vue也越来越受欢迎了；
- Express依然是最流行的Node.js框架(Node 8已经支持async函数了，Koa的价值应该少了很多)；
- Visual Studio code远远超越Sublime，成为最流行的JS编辑器；

作为一个后端用Express框架，尽量使用最新的ECMAScript语法，而前端用着TypeScript，不过框架还是AngularJS 1(这事要怪版本帝Angular不向后兼容)，抛弃价值70刀的Sublime，今年加入VS code阵营的JSer，我也是算是够主流了吧！那你呢？

### ECMAScript 2018

TC39(ECMAScript标准委员会)这些年越来越勤快了，从2015年(ES6)开始，每年发布一个新的ECMAScipt标准。今年大佬们继续忙于处理各种[proposal](https://github.com/tc39/proposals)。[ECMAScript 2018](https://www.ecma-international.org/publications/standards/Ecma-262.htm)，即ES9，则在6月如期发布了，其新增的特性并不多：

**主要新特性:**

- [Asynchronous Iteration](http://2ality.com/2016/10/asynchronous-iteration.html) 
- [Rest/Spread Properties](http://2ality.com/2016/10/rest-spread-properties.html)

**新的正则表达式特性**:

- [RegExp named capture groups](http://2ality.com/2017/05/regexp-named-capture-groups.html)
- [RegExp Unicode Property Escapes](http://2ality.com/2017/07/regexp-unicode-property-escapes.html)
- [RegExp Lookbehind Assertions](http://2ality.com/2017/05/regexp-lookbehind-assertions.html) 
- [`s` (`dotAll`) flag for regular expressions](http://2ality.com/2017/07/regexp-dotall-flag.html)

**其他新特性**:

- [`Promise.prototype.finally()`](http://2ality.com/2017/07/promise-prototype-finally.html) 
- [Template Literal Revision](http://2ality.com/2016/09/template-literal-revision.html) 

如果想了解ES9的细节，阔以看看[Axel Rauschmayer](http://dr-axel.de/)博士写的[Exploring ES2018 and ES2019](http://exploringjs.com/es2018-es2019/toc.html)。

### Node 10

Node 10在4月[发布](https://nodejs.org/en/blog/release/v10.0.0/)并且在10月成为[LTS](https://medium.com/@nodejs/october-brings-node-js-10-x-to-lts-and-node-js-11-to-current-ae19f8f12b51)，即长期支持版本。

Node 10使用了新的[V8引擎](https://v8.dev/)6.8，因此性能提升了很多，比如[Promise与Async函数的性能提升就非常明显](https://v8.dev/blog/fast-async)，因此建议大家升级。

Node新版本的[发布日期](https://github.com/nodejs/release)一直非常稳定，做到这一点也是不容易啊！

![](https://image.fundebug.com/2018-12-24-node.png)

### Vue 3.0

在[Vue.js Conference Toronto 2018](https://vuetoronto.com/)上，尤雨溪发表了主题演讲[Vue 3.0 Updates](https://docs.google.com/presentation/d/1yhPGyhQrJcpJI2ZFvBme3pGKaGNiLi709c37svivv0o/edit#slide=id.p)，新版本将会有这些变化：

- 更快
- 更小
- 更易于维护
- 更多的原生支持
- [放弃Flow，使用TypeScript](https://www.zhihu.com/question/46397274/answer/101193678)

Vue 3.0[预计将在2019发布](https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf)，大家期待吧！

### Babel 7

2年多时间commit了4000多次，[Babel 7终于发布了](https://babeljs.io/blog/2018/08/27/7.0.0)，新增了下面这些特性：

- [babel-upgrade](https://www.npmjs.com/package/babel-upgrade): 升级Babel的工具；
- [babel.config.js](https://babeljs.io/docs/en/next/config-files#project-wide-configuration)：学习ESLint与Webpack，使用JS文件配置；
- [overrides](https://babeljs.io/docs/en/options#overrides)：允许同一个项目使用不同的Babel配置，例如前端代码的targets为Chrome 60，而后端代码的targets为Node 8；
- ...

![](https://image.fundebug.com/2018-12-24-babel.png)

主流浏览器对新的ECMAScript特性已经支持得不错了，不过还是存在并且永远存在很多非主流浏览器，于是我们还是离不开神奇的Babel。

### jQuery 3.3.0

曾经风靡一时的[jQuery发布了3.3.0](http://blog.jquery.com/2018/01/19/jquery-3-3-0-a-fragrant-bouquet-of-deprecations-and-is-that-a-new-feature/)，这个版本放弃了(deprecated)一系列方法：

- jQuery.now
- jQuery.isWindow
- jQuery.camelCase
- jQuery.proxy
- jQuery.type
- jQuery.isNumeric
- jQuery.isFunction
- Event aliases

这些方法大多会在jQuery 4.0中被删除，因此jQuery官方鼓励大家使用替代的方法。

从这个更新也能看出端倪，jQuery时代已经逐渐过去了，[GitHub的极客们干脆完全抛弃了jQuery](https://githubengineering.com/removing-jquery-from-github-frontend/)。

### V8引擎10周年

强大的[V8引擎已经发布10周年了](https://v8.dev/blog/10-years)，它的命名灵感来自超级性能车的V8引擎，果然名副其实！其性能一直稳步提高：

![](https://image.fundebug.com/2018-12-24-v8.png)

V8引擎当初是为Chrome浏览器开发的，但是早已成为一个独立的项目。国内的众多浏览器，包括搜狗、360、猎豹、QQ、百度、UC都是基于[Chromium](https://zh.wikipedia.org/wiki/Chromium)浏览器开发，而Chromium相当于开源版本的Chrome，自然也是基于V8引擎的。因此，众多"国产"浏览器实际上都是基于V8的。融资了2.5亿元红芯浏览器也不例外，[他们干脆打包了Chrome浏览器的安装包](https://www.pingwest.com/a/176061)，果然有钱任性！还有，就连浏览器界的一朵奇葩[Microsoft也投靠了Chromium阵营](https://www.ifanr.com/1138933)。

另外，Node.js也是基于V8引擎的。

### NPM模块[event-stream](https://github.com/dominictarr/event-stream)被黑客攻击

这件事闹得沸沸扬扬，不过只是有很多噱头，如果[认真分析黑客干了什么](https://blog.fundebug.com/2018/12/03/how-does-javascript-hacker-steal-bitcoin/)，其真实影响没那么大，至少Vue开发者没啥好担心的：

- 比特币钱包[copay](https://github.com/bitpay/copay)依赖[event-stream](https://github.com/dominictarr/event-stream)模块；
- 黑客从骗取了[event-stream](https://github.com/dominictarr/event-stream)模块的npm发布权限；
- 黑客为[event-stream](https://github.com/dominictarr/event-stream)模块添加了依赖[flatmap-stream](https://www.npmjs.com/package/flatmap-stream)；
- [flatmap-stream](https://www.npmjs.com/package/flatmap-stream)含有黑客代码，仅会在[copay](https://github.com/bitpay/copay)项目中正确执行，窃取用户的密码、私钥等信息，从而盗取比特币；
- 有人说什么Vue可能遭受攻击，其实没有这回事，因为黑客代码只会在[copay](https://github.com/bitpay/copay)项目中正确执行。只有[copay](https://github.com/bitpay/copay)项目的[package.json](https://github.com/bitpay/copay/blob/cd3f2b380588e6bc90e6c498bf9ae075bcc59e34/package.json)中的[description](https://github.com/bitpay/copay/blob/cd3f2b380588e6bc90e6c498bf9ae075bcc59e34/package.json#L3)字符串"A Secure Bitcoin Wallet"能够解密黑客代码；而且，黑客的代码是为[copay](https://github.com/bitpay/copay)量身定做的，对其他项目没有作用；再说，黑客是来窃取的比特币的，又不是挖矿，你的项目有比特币给人家偷吗?

同学们，不要被标题党给骗了啊！

### 《Refactoring》第2版改用JavaScript

[《重构：改善既有代码的设计》](https://book.douban.com/subject/1229923/)大多数人都没看过，但是至少应该都听过。这本书刚出了[第二版](https://www.amazon.com/gp/product/0134757599)，所有示例代码由Java改成了JavaScript。

根据作者[Martin Fowler](https://martinfowler.com/articles/refactoring-2nd-ed.html)的[解释](https://martinfowler.com/articles/refactoring-2nd-ed.html)，**《重构》这本书重点在于思想，适用于各种编程语言，所以选择什么语言并不重要。**而他选择JavaScript的原因很简单，因为JS既支持面向过程编程，又支持面向对象编程，这样方便写非OOP代码重构的示例。

这里不妨引用[尤雨溪](https://www.zhihu.com/question/46397274/answer/101193678)的一句话：

> 至于重构、设计什么的，我只想说，看的是使用的人的水平，跟用什么语言没那么大关系。水平烂的人用 TS 一样写的是翔一样的代码，看看 java 就知道了。

《Refactoring》的示例代码用什么语言写根本不重要，重要的是背后的编程思想。顺便推荐一下《Clean Code》。

![](https://image.fundebug.com/2018-12-24-refactoring.jpg)

这本书原价54.66刀，的确有点贵，不过算是必读书，大家看着办...

### GitHub抛弃jQuery

一直以来，GitHub最流行的编程语言都是JavaScript，可以说GitHub是全球最大的JS开发者社交平台了；同时，因为被IE的兼容问题折磨了多年，前端痛恨Microsoft！但是，有钱任性的Microsoft以75亿美元收购了GitHub！

另外，[GitHub的技术极客们花了数年时间，以非常规范的流程完全移除GitHub网站了jQuery](https://githubengineering.com/removing-jquery-from-github-frontend/)：

- 实现了一个ESlint插件[eslint-plugin-jquery](https://github.com/dgraham/eslint-plugin-jquery)，禁止在代码中使用已经弃用的jQuery方法。这样可以防止同事使用jQuery方法。
- 使用原生代码重写了2个依赖于jQuery的模块[jquery-pjax](https://github.com/defunkt/jquery-pjax)和[facebox](https://github.com/defunkt/facebox)。
- 开发一个定制的jQuery版本，一旦完全移除某个jQuery方法，就删除jQuery中的对应代码。这样既可以减少jQuery大小，也可以防止同事使用已经移除的jQuery方法。
- 根据用户统计数据，来逐步放弃支持低版本的IE浏览器，这样的话可以无需依赖jQuery来保证兼容性。
- ...

是否使用jQuery各有各的想法和需求，但是**GitHub弃用jQuery的流程非常专业，可以作为处理技术债的标准规范**。

### Microsoft爱上JavaScript

土豪Microsoft似乎爱上了JavaScript，它家的[Office 365, MicroSoft Teams以及Skype都开始使用JavaScript重写了](https://www.reddit.com/r/programming/comments/8qqhlz/comment/e0ll1dt/)。原因无疑是JS的跨平台特性。同一套代码多处运行，虽然现在还有很多问题，但是这样的未来不是挺好么？

此处应该再来感受一下大名鼎鼎的[Atwood's Law](https://blog.codinghorror.com/the-principle-of-least-power/)：

> Any application that can be written in JavaScript, will eventually be written in JavaScript

在浏览器市场上，Microsoft曾经通过捆绑Windows打败了网景，不过这些年在Chrome面前一败涂地，现在终于"认输"，选择[基于Chromium重写浏览器](https://www.ifanr.com/1138933)。对于JSer来说，至少意味着浏览器兼容问题可以缓解很多。

根据[The State of JavaScript 2018](https://2018.stateofjs.com/other-tools/)，Microsoft开发的[Visual Studio code](https://code.visualstudio.com/)俨然已经成为最受JSer欢迎的代码编辑器，一些流行插件下载量高达上千万：

![](https://image.fundebug.com/2018-12-24-vscode.png)

市值超过Apple，重回全球市值最高公司的Microsoft有钱任性，买下了JS开发者最多的GitHub。

IT界的罗马帝国(出处：吴军《浪潮之巅》)Microsoft又重新崛起了，这是一件很了不起的事情。

### Oracle宣示JavaScript主权

[Oracle明年就要开始给Java收费](https://mp.weixin.qq.com/s/gRtOaTXdLYVrIPnejVytMw)，虽然只是JDK 8的u192之后的更新要收费，这个行为大概会让很多Java开发者不爽...

另外，[Oracle还要求一个iOS开发者将一款叫做”HTML5, CSS, JavaScript, HTML, Snippet Editor“的App从App Store下架](https://mp.weixin.qq.com/s/Q5bK8qHgLRzTsrA3NdC9wQ?)，因为App名字中包含“JavaScript”字眼，而Oracle拥有JavaScript在美国的商标权。

Oracle这位大爷惹不起，因此大家正在一本正经地[建议给JavaScript改名](https://www.techrepublic.com/article/why-its-finally-time-to-give-up-on-the-name-javascript/)。当然这基本上是不可能的，这辈子都不可能。。。

### 参考

- [JavaScript黑客是这样窃取比特币的，Vue开发者不用担心！](https://blog.fundebug.com/2018/12/03/how-does-javascript-hacker-steal-bitcoin/)
- [强烈推荐10个值得订阅的国外技术周报](https://blog.fundebug.com/2018/11/28/10-english-technolody-newsletter/)
- [ECMAScript 2018特性确定了](https://blog.fundebug.com/2018/08/10/ecmascript-2018/)





















