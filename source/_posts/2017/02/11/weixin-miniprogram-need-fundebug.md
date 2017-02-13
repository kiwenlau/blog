---
title: Fundebug专业为小程序踩坑

date: 2017-02-11 09:00:00

tags: [Fundebug, 小程序]
---

1月9日微信小程序上线，距离现在仅仅一个月，然而开发者们已经遇到了很多坑:

<!-- more -->

- [一名Android开发者的微信小程序填坑之路(1) - CSDN](http://blog.csdn.net/luoyanglizi/article/details/52681245)
- [微信小程序坑集 - 博客园](http://www.cnblogs.com/dudeyouth/p/6277628.html)
- [吐槽小程序开发踩过的坑, 以及一些解决方法 - 简书](http://www.jianshu.com/p/6359500b5576)
- [微信小程序的坑, 你踩了么？- 知乎](https://www.zhihu.com/question/51145570?sort=created)
- [微信小程序常见问题集合 - 微信小程序联盟](http://www.wxapp-union.com/thread-23-1-1.html)
- ......

#### 微信小程序兼容性问题

小程序依托于微信，似乎天然拥有跨平台的优势。也就是说，开发者只需要开发一套代码，就可以完美运行在Android与iOS上。但是事实上，                                                                             小程序的兼容性问题往往会导致各种BUG。

例1，在[微信小程序兼容性问题](http://www.jianshu.com/p/90220a55f542)中，博主有提到一个实例:
> wx.request()返回的状态码statusCode在iOS下是Int，而在Android上却是String。如果判断statusCode的方法不当，可能就踩到坑里了。

例2，在[微信小程序踩坑之wx.uploadFile](http://www.henkuai.com/thread-17813-1-1.html)中，楼主发现旧版本的微信会出错:
> iOS可以上传文件，Android必须将微信升级到6.5.2版本以上才能上传文件。

例3，在[一个有关二维码扫码的奇怪的问题](http://www.wxapp-union.com/forum.php?mod=viewthread&tid=2122&highlight=%E4%B8%80%E4%B8%AA%E6%9C%89%E5%85%B3%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E7%A0%81%E7%9A%84%E5%A5%87%E6%80%AA%E7%9A%84%E9%97%AE%E9%A2%98)中，楼主遇到了一个ES 6的兼容性问题:
> 开发工具和高版本的iOS支持[startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)，然而在iOS 8和Android不支持startsWith。

为什么会这样呢？不妨学习一下[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/details.html)吧: 

> - 在开发工具上， 小程序的JS代码是运行在nwjs中
- 在iOS上，小程序的JS代码是运行在JavaScriptCore 中
- 在Android上，小程序的JS代码是通过X5 JSCore来解析
 
开发工具，iOS与Andriod的JavaScript脚本执行环境各不相同，所以存在兼容性问题也就不难理解了。开发工具上运行成功的代码，在iOS上未必能够运行成功，而在iOS上运行成功的代码，在Andriod上也可能会出错。

另外，开发工具，iOS与Andriod上的微信本身代码也不一样，因此也会导致一些问题。

#### Fundebug小程序错误监测

更麻烦的是，测试并不能完全保证代码完全正确，一方面逐个测试各种手机是不现实的，另一方面，开发者很难全面考虑各种真实场景。

Fundebug能够实时监测小程序，捕获小程序Bug，然后反馈给开发者。这样，开发者可以及时发现并解决问题，提升用户体验。

<div style="text-align: center;">
<img style="width:80%;" src="weixin-miniprogram-need-fundebug/fundebug-wxjs.jpg" />
</div>

**Fundebug的优势:**

- 小程序在用户的手机上出错了，第一时间提醒开发者；
- 插件仅282字节，即0.28KB，不到1MB的1/3000;
- 添加两行代码，2分钟搞定;
- 仅收集出错信息，保护用户隐私，收集systemInfo和userInfo需要开发者进行配置;


使用方法请参考[微信小程序文档](https://docs.fundebug.com/notifier/wxjs/)。


还等什么呢？赶紧免费注册[Fundebug](https://fundebug.com/team/create)吧！


<div style="background: #fff; text-align: center; height: 50px; line-height: 50px;"><a href="https://fundebug.com/team/create" style="padding: 10px 20px; background: #22A985; color: #FFF; border-radius: 3px;">立即注册 ➔</a></div>
</div>
