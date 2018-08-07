---

title: Fundebug上线支付宝小程序错误监控服务

date: 2018-07-30 10:00:00

tags: [Fundebug, 支付宝小程序]

keywords: Fundebug, 支付宝小程序

description: FFundebug上线支付宝小程序错误监控服务

---

**摘要：** [Fundebug](https://www.fundebug.com/)可以实时监控线上代码BUG，竭诚为您的支付宝小程序应用保驾护航。

<div style="text-align: center;">
<img style="width:60%;" src="fundebug-support-alipay/alipay.jpg" />
</div>

<!-- more -->


中国互联网三大巨头BAT相继推出自家的小程序，希望在这一波浪潮中打造自己的生态系统。其实我一直比较奇怪，这不是iOS和Andriod应该在操作系统层面做的事情吗?

### 为什么监控支付宝小程序？

理论上来讲，BUG是无法避免的，实时监控阔以帮助开发者第一时间发现BUG，及时修复BUG，将BUG的影响降到最低。

开发者通常是比较自信的，他们坚持**我写的代码当然没问题**。然而，再拷问一下自己：

- 我的代码真的100%没有问题吗？
- 我做了完整的测试吗？
- 难道我要花更多的时间没完没了的写单元测试？

有时，用户打开某个页面是空白的，或者点击某个按钮没有反应，或者应用闪退了。然后，用户也许会反馈，但是更多用户默默离开了。

**那么问题在哪？**

- 支付宝小程序在用户的手机上出错了，可是开发者完全不知道；
- 当有用户反馈问题的时候，其实意味着更多用户已经被坑了，他们属于沉默的大多数；
- 知道出问题了，然而开发者没有任何出错信息，无法复现问题，也无从下手；

### 为什么是Fundebug？

- 两行代码搞定;
- 支付宝小程序在用户的手机上出错了，Fundebug第一时间通过邮件提醒开发者；
- Fundebug提供详细的出错信息和强大的错误管理面板，帮助开发者快速解决错误；
- 仅收集出错信息，保护用户隐私;

[Fundebug](https://www.fundebug.com/)自2016年双十一上线，以及累计处理**6亿+**错误，服务众多知名客户，欢迎免费试用。

### 如何使用Fundebug?

##### 1. 下载Fundebug的支付宝小程序插件<a href="https://aliapp.fundebug.cn/fundebug.0.1.0.min.js" >fundebug.0.1.0.min.js</a>

##### 2. 在app.js中引入并配置apikey:

```js
var fundebug = require('./libs/fundebug.0.1.0.min.js')
fundebug.init(
{
    apikey: "API-KEY"
})
```

- `./libs/fundebug.0.1.0.min.js`为相对于app.js的路径 。
- 获取**apikey需要**[免费注册](https://www.fundebug.com/team/create)Fundebug帐号并且[创建项目](https://www.fundebug.com/project/create)。



##### 3. 将aliapp.fundebug.net添加到httpRequest接口请求域名白名单

1. 登陆[支付宝小程序后台](https://open.alipay.com/platform/miniIndex.htm#/)
2. 查看您的小程序
3. 选择右侧『设置』，选择『httpRequest接口请求域名白名单』，点击右侧『添加』，将aliapp.fundebug.net添加到httpRequest接口请求域名白名单。

具体使用细节请查看[Fundebug文档 - 支付宝小程序](https://docs.fundebug.com/notifier/aliapp/)


### 关于Fundebug

[Fundebug](https://www.fundebug.com)专注于JavaScript、微信小程序、微信小游戏、支付宝小程序、React Native、Node.js和Java实时BUG监控。
自从2016年双十一正式上线，Fundebug累计处理了6亿+错误事件，得到了Google、360、金山软件等众多知名用户的认可。欢迎免费试用！

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>

