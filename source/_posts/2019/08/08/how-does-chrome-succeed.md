---
title: JavaScript深入浅出第5课：Chrome是如何成功的？

date: 2019-08-08 10:00:00

tags: [JavaScript深入浅出, Chrome, Google]

keywords: Chrome, Google

description: Chrome是如何成功的？
---

**摘要：** Chrome改变世界。

<!-- more -->

**《[JavaScript深入浅出](https://blog.fundebug.com/tags/JavaScript%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA/)》系列**：

- [JavaScript深入浅出第1课：箭头函数中的this究竟是什么鬼？](https://kiwenlau.com/2019/06/18/arrow-function-this/)
- [JavaScript深入浅出第2课：函数是一等公民是什么意思呢？](https://kiwenlau.com/2019/06/25/javascript-first-class-function/)
- [JavaScript深入浅出第3课：什么是垃圾回收算法？](https://kiwenlau.com/2019/07/03/javascript-garbage-collection/)
- [JavaScript深入浅出第4课：V8是如何工作的？](https://kiwenlau.com/2019/07/16/how-does-v8-work/)
- [JavaScript深入浅出第5课：Chrome是如何成功的？](https://kiwenlau.com/2019/08/08/how-does-chrome-succeed/)

### 前言

在上一篇博客中，我聊了一下[JavaScript引擎V8的工作原理](https://blog.fundebug.com/2019/07/16/how-does-v8-work/)，顺其自然，接下来应该来聊聊渲染引擎Blink或者Chrome浏览器的工作原理。但是，这2个坑以后再填。

这次我重点聊聊产品，当然免不了涉及一些技术。

几乎所有JavaScript开发者每天都在使用Chrome，大家知道它是如何成为浏览器霸主的吗？

### Google为什么要做浏览器？

其实，Google的联合创始人Larry Page和Sergey Brin早在2001年就想做浏览器，但是当时的CEO施密特一直反对，因为从头开发一个浏览器的成本太高了，不是一个创业公司可以承受的。因此，Google直到2006年，公司已经上市2年了，才开始做浏览器，秘密开发了2年，Chrome才正式发布。

Google真正开始开发Chrome是2006年，当时IE的市场占有率高达80%，Firefox大概是10%。自从击败Netscape之后，IE似乎可以高枕无忧了。如果那时候有人要做一个浏览器，大多数人都会质疑，还需要多个浏览器干嘛？IE和Firefox又不是不能用。

但是，2006年时的Web早已经不再是简单的静态页面，Gmail、Youtube、Google Maps，Facebook这些复杂的Web应用已经出现一段时间了，传统浏览器在架构、性能以及稳定性上已经逐渐不再适用了，这时正是需要一款更加强大的浏览器来满足用户与Web开发者的需求。

Google所做的最重要的事情，就是对成千上万的网页进行排序，所以它存在的意义是基于网页的。而一个更快、更好的浏览器，可以促进Web技术的发展，网页会越来越多，越来越好，用户花在Web上的时间越来越多，这对Google是有益。因此，Google要做浏览器，不只是想要一个搜索入口那么简单。

Google希望通过Chrome浏览器来促进Web技术的发展，从而让自己受益，这也不是什么秘密，Chrome团队的人都是这么说的，Google现在的CEO是Sundar Pichai，他当年发布Chrome的时候是[这样说的](https://googleblog.blogspot.com/2008/09/fresh-take-on-browser.html)：

> We hope to collaborate with the entire community to help drive the web forward.

这样假大空的话当年大概没几个人相信，但是这不重要，重要的是Google真的做到了，Chrome确实推动了Web技术的发展。没有Chrome的话，现在的Web技术大概确实得落后不少。

如果Google只是想要一个搜索入口，它可以收购一个浏览器，或者基于开源浏览器套一个壳，做一下账户系统就够了，再通过Google网站进行推广。国内各个大厂的浏览器都是基于Chrome的开源版本Chromium实现的，某个浏览器甚至直接打包了Chrome的安装包。

既然Google想做的事情是推动Web技术发展，如果沿用旧的思想和技术的话，显然是做不到的。于是，他们设计了一个多进程的浏览器架构，重新写了一个性能彪悍的JavaScript引擎V8，后来又基于Webkit做了一个新的渲染引擎Blink。

不妨这样说，**Google与国内的搜索引擎巨头们的还差一个Chrome浏览器**。后者看到的是搜索流量带来的商业价值以及重新开发一个浏览器的巨大成本，而前者看到了Web技术发展对搜索引擎本身的长远价值。

### Chrome就一定能成功吗？

Google终于决定做浏览器了，但这事能不能做成，其实也不一定。和每一个大公司一样，Google失败的项目远远多于成功的项目，大家不妨看看[Killed by Google](https://killedbygoogle.com/)里面的列表。

Google确实有很多非常成功的产品，比如Android，Youtube，Google Maps, DeepMind，但是它们其实都是收购来的。Chrome算是Google为数不多的真正从零开始打造出来的产品。

下面这张图是Chrome发布时的照片：

![](https://image.fundebug.com/2019-08-07-chrome_launch.jpg)
**图片来源：Niall Kennedy**

照片中从左至右是Larry Page, Brian Rakowski, Sundar Pichai, Sergey Brin, Darin Fisher, Lars Bak和Ben Goodger，他们都是Chrome浏览器最关键人物，也都因为Chrome的成功而收益不菲。

- Larry Page和Sergey Brin是Google的创始人，他们一直希望做浏览器；
- Sundar Pichai当时是Google负责产品的副总裁，Chrome也在他的管理范围之类，现在他是Google的CEO；
- Brian Rakowski当时是Chrome的产品经理，现在是Google负责产品的副总裁；
- Lars Bak是JavaScript引擎V8的负责人，曾长期从事编程语言的虚拟机开发工作；
- Darin Fisher是Chrome最早期的开发者，之前是Firefox的工程师，现在是Google负责Chrome的副总裁；
- Ben Goodger是Chrome最早期的开发者，之前是Firefox的工程师，现在的职级为Distinguished Engineer，仅次于Google Fellow以及Senior Google Fellow；

照片中大家都挺开心的，秘密开发了2年的Chrome终于发布了，但是他们能想到10年后Chrome可以占有接近70%的市场份额吗？

下图是2009年到2019年浏览器的市场份额变化，Chrome一路飙升，而一度垄断市场的IE则刚好相反：

![](https://image.fundebug.com/2019-08-07-browser-market-share-2009-2019.jpg)
**图片来源：[Visual Capitalist](https://www.visualcapitalist.com/30-year-timeline-world-wide-web/)**

不妨对比一下1994年到2008年的浏览器市场份额，IE通过免费捆绑Windows把Netscape整垮了，巅峰时期的市场占有率高达96%：

![](https://image.fundebug.com/2019-08-07-browser-market-share-1994-2008.jpg)
**图片来源：[Wired](https://www.wired.com/2008/09/the-browser-wars/)**

浏览器一直是一个硝烟四起的战场，因此浏览器市场份额的变化多少有点戏剧性。

### Chrome为什么会成功？

Chrome为什么会这么成功呢？Google创始人Larry Page是这样说的：

> Chrome has hundreds of millions of happy users and is growing fast thanks to its speed, simplicity and security.

Chrome很快，很简单，也很安全，所以它成功了，这是Page的观点。真的是这样吗？其实也差不多。不过还少了一点，stability，即稳定性。Chrome的产品哲学是一共是4个S：[Speed, Security, Stability以及Simplicity](https://www.chromium.org/developers/core-principles)。其实，这4个S适用于所有互联网产品，要做到话也不是那么容易。

说人话，Chrome究竟有哪些不一样呢？

1. 简洁的用户界面(Simplicity)
2. 多进程架构(Stability, Speed, Security)
3. JavaScript引擎V8(Speed)
4. 渲染引擎Blink(Speed)

用户界面的Simplicity其实不难做到，现在很多浏览器和Chrome看起来也差不多，只是Chrome率先简化了浏览器的界面。这类似于iPhone发布之后，大家明白了一个简单的道理，原来手机只需要一块屏幕就够了，不需要那么多按键，后来所有智能手机基本上都长得一样了...

多进程架构、V8引擎以及Blink引擎都是非常硬核的技术，不是一般开发者可以做到的，就算是现在也很少有人或者公司去尝试做这个，所以现在国内外很多浏览器都是基于Chromium实现的。我想大家心里都清楚，要想这3点上超越Chrome，可能性非常小。

Blink渲染引擎的优化对提高Web性能也至关重要，只是Chrome刚开始用的是Webkit，我会在以后的博客中详细介绍Blink。

当然，Chrome所做的创新远不只这么多，我列举的4点是Chrome成功最关键的要素。

### 简洁的用户界面

Chrome已经发布10多年了，但是它的界面其实没怎么变过：后退图标，前进图标，刷新图标，合并的地址栏与搜索框，书签图标，登陆图标，设置图标...Chrome的界面非常简洁，没有任何多余的元素。

2009年的Chrome是这样的：

![](https://image.fundebug.com/2019-08-07-chrome-2009.png)
**图片来源：[Gmail in 30 seconds](https://www.youtube.com/watch?v=ol3EI10ZiUc)**

2019年的Chrome是这样的：

![](https://image.fundebug.com/2019-08-07-chrome-2019.png)

Chrome发布时，IE8也差不多在同一时期发布，但是它的界面就没那么简洁了：

![](https://image.fundebug.com/2019-08-07-ie8.png)

通常，用户应该不会去点击“页面”、“安全”、“工具”等选项，其实它们完全可以隐藏起来。Chrome的很多选项都是隐藏在设置选项里面，其实更加科学。

Chrome是第一个将地址栏与搜索框合并的浏览器，合并的框被称为Omnibox，用户既可以输入地址，也可以搜索关键字。当用户输入时，Chrome还会进行实时推荐用户可能要访问的网页。

Chrome还把书签栏给隐藏了，这对于重度书签用户(比如我)来说带来一些不便，但是这也让界面又简洁了很多。很多浏览器的书签栏不仅没有隐藏，还会添加很多莫名其妙的默认书签，甚至很多软件安装时也会给浏览器添加一些书签，而这些书签其实很多用户都不会访问。

合并地址栏和搜索框，隐藏书签栏，这样做不只是让用户界面更加简洁，还可以培养用户的搜索习惯，让用户不在需要记住特定的网站。

Chrome与IE8的Tab位置是不一样的，Chrome的Tab在上面，而IE8的Tab在下面，这个区别似乎没那么重要，不过也没那么简单。Tab是Chrome用户界面最重要的元素，每一个Tab使用独立的进程，Tab可以拖拽出来作为独立的窗口，相当于一个独立的应用。

Chrome的设计哲学是"Content, not Chrome"，因此它们Tab置顶，把一切可以省略的东西都去掉，比如搜索框、状态栏、书签栏以及各种设置的快捷方式，尽量让每一个Tab看起来像一个独立的应用：邮件、视频、社交或者购物等，不要让多余的浏览器元素影响用户体验，让用户专注于Web应用本身，让Web应用越来越重要，这不不正是Google的阳谋吗？

Chrome的产品哲学与iPhone以及微信本质是一样的，都是极简主义，这个地球人都知道，但是没有多少产品可以真正做到。为什么呢？因为要做到极简主义，需要**深刻思考用户需求以及产品价值**。

### 多进程架构

Chrome的每一个Tab和插件，都使用独立的进程。这样可以**提高浏览器的性能、安全性以及稳定性**：

- 充分利用多核CPU，不同的进程可以使用不同的CPU核运行；
- 便于限制Tab与插件进程的权限，减少安全隐患；
- 当某一个Tab的页面崩溃了，不会导致其他Tab崩溃，整个浏览器还可以正常使用；

多进程架构借鉴了现代操作系统的设计思想，浏览器不再是一个简单的应用，它是一个平台，可以用于独立运行各种各样的Web应用。

使用Chrome的任务管理器，可以查看每一个Tab和插件进程所使用的CPU、内存已经网络。这样可以帮助Web开发者优化代码，高效利用计算机资源。

![](https://image.fundebug.com/2019-08-07-chrome-task-manager.png)

既然多进程架构有这么多好处，那为什么以前的浏览器采用单进程架构呢？因为IE、Firefox等浏览器诞生时，Web还非常简单，大多是静态页面，单进程就够用了，而且当年也没有什么多核CPU。

从单进程架构切换到多进程架构是一个非常复杂的过程，Firefox从2009年到2017年花了整整8年时间才完成切换。从这一点来说，Firefox落后了Chrome接近10年。这倒不是因为Chrome的工程师特别厉害，而是因为Chrome从一开始就设计了多进程架构，没有什么技术债。

### JavaScript引擎V8

Chrome的性能优异，很大程度上要归功于他们的重新的开发的[JavaScript引擎V8](https://blog.fundebug.com/2019/07/16/how-does-v8-work/)。V8引擎可以将JS代码编译为高效的汇编代码，同时还要负责执行代码、分配内存以及[垃圾回收](https://blog.fundebug.com/2019/07/03/javascript-garbage-collection/)。

V8引擎的命名灵感来自超级性能车的V8引擎，敢于这样命名确实需要一些实力，它性能确实一直在稳步提高，下面是使用[Speedometer benchmark](https://browserbench.org/Speedometer/)的测试结果：

![](https://image.fundebug.com/2019-07-16-speedometer-1.png)
**图片来源：https://v8.dev**

JavaScript是动态的，且没有类型，这会给V8引擎编译JS代码时带来很多麻烦。不过V8引擎可以记录代码第一次执行时的类型信息，当代码第二次执行时，则可以根据记录的类型信息生成优化的汇编代码。另外，V8引擎还会为Object生成动态的hidden class，用来记录Object的结构，以提高属性的访问速度。

V8引擎的垃圾回收算法也非常强大，可以大幅减少内存使用。最近有人对比了一下3中不同类型的JS引擎JavaScriptCore、Hermes以及V8在React Native应用中的内存使用情况，发现V8的内存使用量明显低于其他引擎，且非常平稳：

![](https://image.fundebug.com/2019-08-07-javascriptcore_Hermes_v8.png)

**图片来源：[Bhaskar gyan vardhan](https://dev.to/anotherjsguy/react-native-memory-profiling-jsc-vs-v8-vs-hermes-1c76)**

关于V8引擎以及垃圾回收算法的技术细节，大家可以阅读我的博客：
- [JavaScript深入浅出第4课：V8引擎是如何工作的？](https://blog.fundebug.com/2019/07/16/how-does-v8-work/)
- [JavaScript深入浅出第3课：什么是垃圾回收算法？](https://blog.fundebug.com/2019/07/03/javascript-garbage-collection/)

V8引擎不只是让Chrome变快，它也让JavaScript变得更加强大，让JavaScript生态系统变得异常繁荣。Node.js也是基于V8引擎的，因为有Node.js，才有了数量庞大的NPM模块，才有了各种各样的JavaScript开发框架和工具。

### Chrome会成为下一个IE吗？

也许是树大招风，最近批评Chrome的声音越来越多了，有人甚至说Chrome会成为下一个IE6。个人觉得这个有点危言耸听。

Chrome从一开始就是开源的，"Talk is cheap, show me the code"，如果实在对Chrome有啥特别不爽的地方，其实可以去改代码，或者fork一个更好的版本。

Chrome从一直是尊重技术标准的，它在发布的时候就通过了[Acid](http://www.acidtests.org/)测试，更重要的是，它一直在推动HTML5、CSS、ECMAScript、HTTPS, HTTP/2, WebAssembly, Service Workers, Source Map等Web相关技术标准的发展，大家可以在各个标准提案中看到Google工程师的身影。

有人说Google工程师最大的问题就是喜欢提新的技术标准，但是有标准比没有标准要好太多了，国内各个大厂小程序做了快3年了，至今连个标准都没有，各玩各的，这样做导致整个小程序行业一起加班，一起重复劳动。最严重的问题在于，没有标准会制约小程序的进一步发展，大家无法给用户提供最好的产品。

开放繁荣的Web符合Google的长远利益，因为Google是靠Web广告赚钱的；但是Web对于Microsoft来说一直就没有太大商业价值，因为Microsoft卖的是操作系统；按照吴军老师的基因论，IE之所以失败是Microsoft的基因决定的，而Google的基因决定了它必须把Chrome做好。

从目前的情况来看，Chrome依然会保持简洁的界面，性能也会一直提高，这样的话，用户和开发者也没有多少动力去换浏览器。我已经用了7年Chrome了，未来还会继续用下去，那你呢？

关于JS，我打算花1年时间写一个系列的博客**《[JavaScript深入浅出](https://blog.fundebug.com/tags/JavaScript%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA/)》**，大家还有啥不太清楚的地方？不妨留言一下，我可以研究一下，然后再与大家分享一下。欢迎添加我的个人微信(KiwenLau)，我是[Fundebug](https://www.fundebug.com/)的技术负责人，一个对JS又爱又恨的程序员。

### 参考

- [The Google Chrome Comic](https://www.google.com/googlebooks/chrome/index.html)
- [Inside Chrome: The Secret Project to Crush IE and Remake the Web](https://www.wired.com/2008/09/mf-chrome/)
- [From PM to CEO: How Sundar Pichai’s Background in Product Paved the Way for Becoming CEO at Google](https://www.productplan.com/sundar-pichai-product-manager-to-ceo/)
- [Chrome is turning into the new Internet Explorer 6](https://www.theverge.com/2018/1/4/16805216/google-chrome-only-sites-internet-explorer-6-web-standards)
- [From 0 to 70% Market Share: How Google Chrome Ate the Internet](https://usefyi.com/chrome-history/)
- [Google Chrome launch](https://www.flickr.com/photos/niallkennedy/albums/72157607077467816)
- [Modern Multi-Process Browser Architecture](https://helgeklein.com/blog/2019/01/modern-multi-process-browser-architecture/)
- [Photos: 10 years of Google Chrome](https://www.techrepublic.com/pictures/photos-10-years-of-google-chrome/)
- [Timeline: The 30-Year History of the World Wide Web](https://www.visualcapitalist.com/30-year-timeline-world-wide-web/)
- [How we designed Chrome 10 years ago](https://blog.chromium.org/2018/09/how-we-designed-chrome-10-years-ago.html)
- [The Chromium Projects: Core Principles](https://www.chromium.org/developers/core-principles)