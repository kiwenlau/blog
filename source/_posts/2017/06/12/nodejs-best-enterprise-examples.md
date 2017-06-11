---
title: 10个最佳Node.js企业应用案例：从Uber到LinkedIn

date: 2017-06-12 10:00:00

tags: [Node.js, 翻译]

---

**译者按:** Node.js 8已经发布了，NPM模块每周下载量早已超过10亿，从Uber到LinkedIn都在使用Node.js，谁说JavaScript不能写后台？

<!-- more -->

原文: [10 best Node.js app examples for enterprises, with metrics](https://thinkmobiles.com/blog/node-js-app-examples/)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**。

### 1. Uber

在过去的两年里，Uber的规模每半年就会翻倍。Node.js之所以被选中，正是由于它强大的数据处理能力。

Uber需要为用户和司机提供可靠的服务，因此用车需求增加时，需要扩展服务，这是另外一个考虑因素。根据[How Uber Uses Node.js to Scale Their Business](https://nodejs.org/static/documents/casestudies/Nodejs-at-Uber.pdf)，Uber选择Node.js的原因如下:

- 它可以高效稳定地处理大量数据
- 错误分析很方便，可以加快开发进度
- 拥抱开源，因此技术持续进步

Uber每天可以处理20亿个**远程过程调用(Remote Procedure Call，RPC)**，足以证明Node.js的成功。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/uber.jpg" />
</div>

### 2. PayPal

PayPal需要为全世界2亿活跃用户提供服务，它做得非常完美。刚开始，PayPay需要将团队成员分工，分别开发前后端应用。自从PayPal选择使用Node.js替代Java开发后端，整个团队只需要使用一种编程语言—JavaScript。

根据[Node.js at PayPal](https://www.paypal-engineering.com/2013/11/22/node-js-at-paypal/)，使用Node.js之后，应用开发速度提高了**2倍**；代码量减少了**33%**；文件数目减少了**40%**，并且，每秒处理的请求数增加了**2倍**，接口的请求时间减少了**35%**。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/paypal.jpg" />
</div>

### 3. Netflix

Netflix是世界上最大的视频和流数据服务之一，根据[Making Netflix.com Faster](https://medium.com/netflix-techblog/making-netflix-com-faster-f95d15f2e972)，Node.js使得应用启动时间减少了**70%**。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/netflix.jpg" />
</div>

### 4. Ebay

 经过激烈讨论，Eabay工程师最终选择了Node.js，因为他们对实时性要求非常高。根据[How We Built eBay’s First Node.js Application](http://www.ebaytechblog.com/2013/05/17/how-we-built-ebays-first-node-js-application/)，Ebay尝试用Node.js开发一个应用之后，就将整个后端从Java都迁移到了Node.js。Ebay有**1.7亿**活跃用户，这说明Node.js能够处理大量的网络请求。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/ebay.jpg" />
</div>

### 5. Walmart

被内存泄漏问题折磨了大半年之后，Walmart的后端工程师选择了Node.js。他们使用Node.js重写后端API之后，发现他们的发布时间大幅减少了。Walmart使用了这些技术栈:

- HAPI (Walmart的开源后端框架)
- 私有NPM模块

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/walmart.jpg" />
</div>

### 6. Medium

Medium是一个非常受欢迎的阅读平台，它平均每月有2500万读者，每周发布数千篇文章。根据[The Stack That Helped Medium Drive 2.6 Millennia of Reading Time](https://medium.engineering/the-stack-that-helped-medium-drive-2-6-millennia-of-reading-time-e56801f7c492)，Memdium的后端主程是由Node.js开发的，使用[Matador](https://medium.github.io/matador/)作为后台框架。使用Node.js帮助他们可以在前后端复用代码。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/medium.jpg" />
</div>

### 7. NASA

在[Node.js Helps NASA Keep Astronauts Safe and Data Accessible](https://nodejs.org/static/documents/casestudies/Node_CaseStudy_Nasa_FNL.pdf)中，NASA表示"Node.js保证了宇航员的安全"，是不是感觉很意外？在太空中发生一次危险的意外之后，NASA发现它的数据分散在各个不同的地方。于是，他们决定使用Node.js构建一个端到端系统来存储数据。NASA使用Node.js构建的应用将数据从不同的地方复制到云数据中，这样:

- 单个云数据库保存了所有数据
- 数据读取时间减少了300%

NASA数据存储更加安全，使用更加方便之后，这就意味着宇航员可以更加安全地在太空中工作了!

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/nasa.jpg" />
</div>

### 8. Mozilla

Mozilla使用Node.js开发了大量应用，基于以下两个主要原因：

- 节省内存使用，因为**Browser ID**服务1百万用户。
- 在前后端同时使用JavaScript，这样可以提高开发效率。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/mozilla.jpeg" />
</div>



### 9. Trello

Trello是最好用的项目管理工具之一。根据[The Trello Tech Stack](https://blog.fogcreek.com/the-trello-tech-stack/)，Trello在2011年在开始之初就在前后端均使用了JavaScript。因为需要处理大量的网络请求，他们使用Node.js开发后端。

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/trello.png" />
</div>

### 10. LinkedIn

LinkedIn拥有**4.5亿**用户，2016年微软以**260亿美元**收购了它。LinkedIn的移动应用的后端是由Ruby on Rails切换到了Node.js。根据[LinkedIn Moved From Rails To Node](http://highscalability.com/blog/2012/10/4/linkedin-moved-from-rails-to-node-27-servers-cut-and-up-to-2.html)，优异的性能和扩展性是LinkedIn选择Node.js的主要原因。使用Node.js之后:

- 某些场景下，性能提高20倍
- 服务器由30个减少到了3个

<div style="text-align: center;">
<img style="width:80%;" src="./nodejs-best-enterprise-examples/linkedin.jpg" />
</div>

### 参考链接

- [How Uber Uses Node.js to Scale Their Business](https://nodejs.org/static/documents/casestudies/Nodejs-at-Uber.pdf)
- [Node.js at PayPal](https://www.paypal-engineering.com/2013/11/22/node-js-at-paypal/)
- [Making Netflix.com Faster](https://medium.com/netflix-techblog/making-netflix-com-faster-f95d15f2e972)
- [How We Built eBay’s First Node.js Application](http://www.ebaytechblog.com/2013/05/17/how-we-built-ebays-first-node-js-application/)
- [The Stack That Helped Medium Drive 2.6 Millennia of Reading Time](https://medium.engineering/the-stack-that-helped-medium-drive-2-6-millennia-of-reading-time-e56801f7c492)
- [Node.js Helps NASA Keep Astronauts Safe and Data Accessible](https://nodejs.org/static/documents/casestudies/Node_CaseStudy_Nasa_FNL.pdf)
- [The Trello Tech Stack](https://blog.fogcreek.com/the-trello-tech-stack/)
- [LinkedIn Moved From Rails To Node](http://highscalability.com/blog/2012/10/4/linkedin-moved-from-rails-to-node-27-servers-cut-and-up-to-2.html)


欢迎加入[我们Fundebug](https://fundebug.com/)的**Node.js技术交流群: 177654062**。

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_nodejs.JPG" />
</div>



