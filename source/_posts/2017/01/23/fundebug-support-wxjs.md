---
title: Fundebug上线小程序错误监控啦

date: 2017-01-23 09:00:00
---

作为专业的JavaSript错误实时监测平台，[Fundebug](https://fundebug.com/)的**微信小程序实时错误监测服务**上线啦，我们能够帮助开发者及时，高效地发现并且解决小程序错误，从而提升用户体验。

<!-- more -->

#### 小程序大时代

后移动互联网时代，创业者们纠结于开发APP还是公众号，而小程序的横空出世，让大家多了一种选择，也给未来增加了更多想象空间。

小程序，正如它的名字，可以理解为迷你版的APP；它生根于微信帝国，因此也可以看作升级版的公众号。准确的说，小程序介于APP的灵活与公众号的轻巧之间，符合国人对中庸之道的信仰。对于那些低频，简单的工具类应用，小程序应该是一个不错的选择。

从技术角度理解，小程序=**WXML + WXSS + JavaScrip**。WXML与WXSS只不过是换了个马甲的HTML与CSS，而JavaScript还是那个无处不在的JavaScript。或者说，小程序就是定制版的**HTML + CSS + JavaScript**。对于开发者，小程序没有什么神奇之处，不过是写几个简单的网页罢了。

如果说小程序预示着一个应用轻型化的小时代，那么JavaScript正在开创属于它的大时代，从网页，到后端，到小程序，到APP以及智能硬件...

<div style="text-align: center;">
<img style="width:80%;" src="fundebug-support-wxjs/fundebug-wxjs.jpg" />
</div>


#### Fundebug为什么监测小程序？

程序员通常是比较自信的，他们坚持**自己写的代码没有问题**。然而，再追问一下自己：

- 我的代码真的100%没有问题吗？
- 我做了完整的测试吗？
- 难道我要花更多的时间没完没了的写单元测试？

有时，用户打开某个页面是空白的：

<div style="text-align: center;">
<img style="width:40%;" src="fundebug-support-wxjs/empty.png" />
</div>

然后，用户转身离开了:(

**那么问题在哪？**

- 小程序在用户的手机上出错了，可是开发者不知道啊；
- 当有用户反馈问题的时候，其实更多用户已经被坑了啊；
- 知道出问题了，然而开发者没有出错信息，无从下手啊；

#### 为什么是Fundebug？

- 小程序在用户的手机上出错了，Fundebug第一时间通过邮件提醒开发者；
- Fundebug提供详细的出错信息和强大的错误管理面板，帮助开发者快速解决错误；
- 插件仅282字节，即0.28KB，不到1MB的1/3000;
- 两行代码搞定;
- 仅收集出错信息，保护用户隐私，收集systemInfo和userInfo需要开发者进行配置;

#### 如何使用Fundebug?

##### 1. 下载Fundebug微信小程序插件<a href="https://ojv8yfncs.qnssl.com/fundebug.0.0.3.min.js" download>fundebug.0.0.3.min.js</a>

微信小程序不支持导入外部JavaScript文件，因此需要手动下载，然后放到项目目录内。

##### 2. 在`app.js`中引入fundebug并配置`apikey`:

```js
var fundebug = require('./libs/fundebug.0.0.3.min.js')
fundebug.apikey = "API-KEY";
```

- `./libs/fundebug.0.0.3.min.js`为相对于`app.js`的路径 。
- 获取**apiKey需要**[免费注册](https://fundebug.com/team/create)帐号并且[创建项目](https://fundebug.com/project/create)。

##### 3. 将[https://fundebug.com](https://fundebug.com)添加到**request合法域名**

具体步骤请查看[Fundebug文档](https://docs.fundebug.com/notifier/wxjs/)
