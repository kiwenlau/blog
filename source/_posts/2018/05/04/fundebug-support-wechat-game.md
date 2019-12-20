---

title: Fundebug上线微信小游戏错误监控！支持自动截屏！

date: 2018-05-04 10:00:00

tags: [Fundebug]

---

**摘要：** Fundebug竭诚为你的小游戏保驾护航。


<!-- more -->

<div style="text-align: center;">
<img style="width:70%;" src="fundebug-support-wechat-game/game.png" />
</div>

想必大家都玩过“跳一跳”吧？刷排行榜的感觉是不是很好啊！还有“知乎答题王”呢，在智力上碾压老铁简直太棒了！

自带社交属性的小游戏很火，是微信帝国的另一座金矿！

### 为什么监控小游戏？

理论上来讲，BUG是无法避免的，实时监控阔以帮助开发者第一时间发现BUG，及时修复BUG，将BUG的影响降到最低。

开发者通常是比较自信的，他们坚持**我写的代码当然没问题**。然而，再拷问一下自己：

- 我的代码真的100%没有问题吗？
- 我做了完整的测试吗？
- 难道我要花更多的时间没完没了的写单元测试？

有时，用户打开某个页面是空白的：

<div style="text-align: center;">
<img style="width:30%;" src="fundebug-support-wechat-game/empty.png" />
</div>

然后，用户转身离开了:(

**那么问题在哪？**

- 小游戏在用户的手机上出错了，可是开发者完全不知道啊；
- 当有用户反馈问题的时候，其实意味着更多用户已经被坑了，他们属于沉默的大多数；
- 知道出问题了，然而开发者没有任何出错信息，无从下手啊；

### 为什么是Fundebug？

- 两行代码搞定;
- 小游戏在用户的手机上出错了，Fundebug第一时间通过邮件提醒开发者；
- Fundebug提供详细的出错信息和强大的错误管理面板，帮助开发者快速解决错误；
- 划重点，**支持出错页面自动截屏！**让开发者直观感受BUG的效果和严重性；
- 仅收集出错信息，保护用户隐私，收集systemInfo和userInfo需要开发者进行配置;

### 如何使用Fundebug?

##### 1. 下载Fundebug微信小游戏插件<a href="https://wegame.fundebug.cn/fundebug.0.1.0.min.js" download>fundebug.0.1.0.min.js</a>

##### 2. 在`game.js`中引入并配置`apikey`:

```js
var fundebug = require('./libs/fundebug.0.1.0.min.js')
fundebug.init({
  apikey: "1639285d4a984765bbb4d2f9162d367dde6ad07b615dd4b12573b71fd0066833"
});
```

##### 3. 将[https://wegame.fundebug.net](https://wegame.fundebug.net)添加到**request合法域名**

具体步骤请查看[Fundebug文档](https://docs.fundebug.com/notifier/wegame/)
