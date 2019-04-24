---
title: Fundebug支持浏览器报警

date: 2019-04-10 10:00:00

tags: [产品, Fundebug]

keywords: Fundebug, BUG监控, 浏览器报警, JS监控

description: Fundebug支持浏览器报警
---

**摘要：** 除了邮件报警和第三方报警，我们新增了浏览器报警功能。

<!-- more -->

### 邮件报警与第三方报警

[Fundebug](https://www.fundebug.com)是专业的应用BUG监控服务，当您的线上应用，比如网页、小程序、Java等发生BUG时，我们会第一时间发送**邮件报警**，这样可以帮助您及时发现BUG，快速修复BUG。

另外，我们还支持各种**第三方报警**方式，如下：

- [钉钉](https://docs.fundebug.com/alert/dingtalk/)
- [Slack](https://docs.fundebug.com/alert/slack/)
- [倍洽](https://docs.fundebug.com/alert/bearychat/)
- [简聊](https://docs.fundebug.com/alert/jianliao/)
- [Worktile](https://docs.fundebug.com/alert/worktile/)
- [零信](https://docs.fundebug.com/alert/pubu/)
- [自定义Webhook](https://docs.fundebug.com/alert/outgoing/)

### 浏览器报警

为了帮助用户第一时间发现BUG，我们支持了浏览器报警。

默认情况下，如果您保持Fundebug控制台打开，我们会每隔1个小时检查是否有新的错误出现，并且通过浏览器提醒告诉您：

![](https://image.fundebug.com/2019-0410-alert.png)

您也可以在项目设置页面对该功能进行配置，选择开启或者关闭浏览器提醒，或者配置浏览器提醒的时间间隔（取值为60到3600秒之间）。

![](https://image.fundebug.com/2019-0410-configuration.png)

最后，感谢Fundebug用户**大宝**的反馈。