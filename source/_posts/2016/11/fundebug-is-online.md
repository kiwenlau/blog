---
title: Fundebug上线了！

date: 2016-11-11 00:00:00

tags: [Fundebug]

---

当我们解决了一个又一个Bug，然后进行了一轮又一轮代码审查，之后又跑了一遍又一遍测试，代码终于上线了！

<!-- more -->

然而，我们能够保证上线的代码一定没有Bug吗？似乎没有人可以这样肯定。

用户使用应用的画风很可能是这样的:

- 为啥『注册』按键点击了半天没有反应？！
- 为啥『激活邮件』一直木有收到？！
- 为啥狂按F5时页面并没有更新？！
- 为啥APP莫名其妙地闪退了？！
- ......

这时，用户的内心是崩溃的，『这是什么破软件？果断弃了』。我们可怜的程序员如果知道挨骂了，也表示很无语，明明单元测试都通过了啊，覆盖率妥妥的100%有木有。。。

其实呢，线上代码出Bug也是很正常的事：

- 一些意想不到的边界条件（内存溢出，死循环，Null, Undefined）;
- 代码的运行环境（各种浏览器，各种手机）千变万化;
- 代码运行依赖的系统比如数据库(MySQL, MongoDB, Redis)偶尔抽风;
- 峰值情况下网络超时，CPU和内存超负荷;
- ......

还有，网页应用是运行在用户的浏览器上，APP是运行在用户的手机上，所以应用出错的时候程序员是不知道的，这样的话，就无法及时解决Bug，用户体验是很不好的。


<div style="text-align: center;">
<a href="https://fundebug.com">
<img style="width:80%;" src="fundebug-is-online/without_fundebug.jpg" />
</a>
</div>

<!--对于后端代码，目前一般的做法是把错误日志输出到文本里面，Debug的时候再去查看。程序员需要SSH登陆到服务器（也许是很多台服务器），然后用终端工具(grep, awk, vim...)进行查找，这种做法效率是很低的。-->

那么，您是否需要稳定，安全，智能的错误实时监控与纠错辅助服务？如果需要，[Fundebug](https://fundebug.com/)已经正式上线了，赶紧[免费注册](https://fundebug.com/team/create)吧!

<div style="text-align: center;">
<a href="https://fundebug.com">
<img style="width:40%;" src="https://fundebug.com/assets/images/logo/fundebug.jpg" />
</a>
</div>

Fundebug, Debug with Fun! 我们致力于提供最专业的Bug实时监测服务，让Debug变得更加高效而有趣。目前我们提供JavaScript实时监测服务，您只需要添加一行代码:

```
<script src="https://og6593g2z.qnssl.com/fundebug.0.1.0.min.js" apikey="YOUR-API-KEY-HERE"></script>
```

使用Fundebug，您就可以:

- 邮件提醒，更及时地发现错误!
- 智能面板，更方便地管理错误!
- 任务分配，更高效地团队协助!
- 错误搜索，更准确地定位错误！

<div style="text-align: center;">
<a href="https://fundebug.com">
<img style="width:80%;" src="fundebug-is-online/with_fundebug.jpg" />
</a>
</div>

还等什么呢，赶紧为您的团队注册Fundebug帐号吧！


<div style="background: #fff; text-align: center; height: 50px; line-height: 50px;"><a href="https://fundebug.com/team/create" style="padding: 10px 20px; background: #22A985; color: #FFF; border-radius: 3px;">立即注册 ➔</a></div>
</div>



