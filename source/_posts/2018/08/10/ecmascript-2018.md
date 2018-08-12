---

title: ECMAScript 2018特性确定了！

date: 2018-08-10 10:00:00

tags: [JavaScript,翻译]

keywords: ECMAScript 2018, ES9

description: ECMAScript 2018特性确定了！

---

**译者按：**  ECMAScript 2018 = ES9!


<!-- more -->

- **原文**：[ECMAScript 2018: the final feature set](http://2ality.com/2017/02/ecmascript-2018.html)
- **作者**: [Dr. Axel Rauschmayer](http://2ality.com/p/about.html)
- **译者**：[Fundebug](https://www.fundebug.com/)

[ECMAScript 2018](https://github.com/tc39/proposals/blob/master/finished-proposals.md)的特性在TC39会议(2018-01-23 ~ 2018-01-25)已经确定了，这篇博客将简单介绍一下。

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

### 关于ECMAScript版本 

注意，自从[TC39特性批准流程](http://exploringjs.com/es2016-es2017/ch_tc39-process.html)建立起来之后，ECMAScript版本的重要性就降低了。真正重要的是某个特性所属的[阶段](http://es6.ruanyifeng.com/#docs/intro#%E8%AF%AD%E6%B3%95%E6%8F%90%E6%A1%88%E7%9A%84%E6%89%B9%E5%87%86%E6%B5%81%E7%A8%8B)，一旦达到了第4阶段(Stage 4: finished)，这个特性就可以放心使用了。不过，你仍然需要确认引擎是否支持该特性。

### ES2018特性  

**主要新特性:**

- [Asynchronous Iteration](http://2ality.com/2016/10/asynchronous-iteration.html) (Domenic Denicola, Kevin Smith)
- [Rest/Spread Properties](http://2ality.com/2016/10/rest-spread-properties.html) (Sebastian Markbåge)

**新的正则表达式特性**:

- [RegExp named capture groups](http://2ality.com/2017/05/regexp-named-capture-groups.html) (Gorkem Yakin, Daniel Ehrenberg)
- [RegExp Unicode Property Escapes](http://2ality.com/2017/07/regexp-unicode-property-escapes.html) (Mathias Bynens)
- [RegExp Lookbehind Assertions](http://2ality.com/2017/05/regexp-lookbehind-assertions.html) (Gorkem Yakin, Nozomu Katō, Daniel Ehrenberg)
- [`s` (`dotAll`) flag for regular expressions](http://2ality.com/2017/07/regexp-dotall-flag.html) (Mathias Bynens)

**其他新特性**:

- [`Promise.prototype.finally()`](http://2ality.com/2017/07/promise-prototype-finally.html) (Jordan Harband)
- [Template Literal Revision](http://2ality.com/2016/09/template-literal-revision.html) (Tim Disney)

*[Fundebug](https://www.fundebug.com/)专注于网页、微信小程序、微信小游戏，支付宝小程序，React Native，Node.js和Java线上BUG实时监控，欢迎免费试用*

### FAQ  

#### 有官方的ECMAScript特性列表吗？

有，TC39仓库列出了所有[已经完成的特性提案](https://github.com/tc39/proposals/blob/master/finished-proposals.md)，并且列出了特性所属的ECMAScript版本。

#### Stage是什么意思呢？ 

Stage指的是[TC39特性批准流程](http://exploringjs.com/es2016-es2017/ch_tc39-process.html)的阶段：

- Stage 0 - Strawman（展示阶段）
- Stage 1 - Proposal（征求意见阶段）
- Stage 2 - Draft（草案阶段）
- Stage 3 - Candidate（候选人阶段）
- Stage 4 - Finished（定案阶段）

#### 我感兴趣的特性处在哪个Stage呢？

你可以到[ECMA-262仓库的readme](https://github.com/tc39/ecma262/blob/master/README.md)查看特性所处的Stage。

#### 延伸阅读  

以下我写的书都可以在网上免费阅读：

- ECMAScript 5: “[Speaking JavaScript](http://speakingjs.com/es5/)”
- ECMAScript 6: “[Exploring ES6](http://exploringjs.com/es6/)”
- ECMAScript 2016 & 2017: “[Exploring ES2016 and ES2017](http://exploringjs.com/es2016-es2017/)”
- ECMAScript 2018 & 2019: “[Exploring ES2018 and ES2019](http://exploringjs.com/es2018-es2019/)”


### 参考

- [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/intro#%E8%AF%AD%E6%B3%95%E6%8F%90%E6%A1%88%E7%9A%84%E6%89%B9%E5%87%86%E6%B5%81%E7%A8%8B)

### 关于Fundebug
[Fundebug](https://www.fundebug.com)专注于JavaScript、微信小程序、微信小游戏、支付宝小程序、React Native、Node.js和Java实时BUG监控。
自从2016年双十一正式上线，Fundebug累计处理了6亿+错误事件，得到了Google、360、金山软件等众多知名用户的认可。欢迎免费试用！

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>

