---
title: Fundebug微信小程序BUG监控服务支持Source Map

date: 2019-08-26 10:00:00

tags: [小程序, Source Map]

keywords: JavaScript, ES6, 解构赋值

description: Fundebug微信小程序BUG监控服务支持Source Map
---


**摘要：** 自动还原真实出错位置，快速修复BUG。

![](https://image.fundebug.com/2019-0422-wxjs_update.jpg)

<!-- more -->

### Source Map功能

> 微信小程序的Source Map功能目前只在 iOS 6.7.2 及以上版本支持。

微信小程序在打包时，会将所有 js 代码打包成一个文件，从而减少体积，加快访问速度。

然而，压缩代码的错误是很难Debug的，因为错误位置是这样的:

- 文件：app-service.js
- 行号：13782
- 列号：7974

这时，错误的位置信息(**文件，行号和列号**)失去了价值，因为开发者很难知道它所对应的源代码位置。

Fundebug的微信小程序BUG监控支持通过Source Map还原出错位置：

- 文件：utils/util.js
- 行号：573
- 列号：8

这样的话，开发者能够迅速定位出错的源代码。

在Fundebug控制台，只需要点击Source Map按钮，就可以切换压缩前后的堆栈：

![](https://image.fundebug.com/2018-08-24-fundebug-wechat-miniprogram-sourcemap.gif)

如果希望使用Source Map功能，用户则需要：

- 从微信小程序管理后台[下载Source Map](https://docs.fundebug.com/notifier/wxjs/sourcemap/download.html)文件
- 在Fundebug项目管理后台[上传Source Map](https://docs.fundebug.com/notifier/wxjs/sourcemap/upload/)文件

### 下载Source Map文件

- 登陆[微信公众平台](https://mp.weixin.qq.com/)
- 切换到左侧"开发"页面
- 点击链接"下载线上版本Source Map文件" 

### 上传Source Map文件

将下载的Source Map文件解压缩，仅需上传解压缩的文件中的**\_\_APP\_\_/app-service.map.map**文件。

**上传步骤**

- 进入Fundebug『控制台』
- 选择『项目设置』
- 点击『Source Map』
- 选中需要上传的Source Map文件(支持上传多个Source Map文件)
- 点击『上传』

上传Source Map时可以配置应用版本:

![](https://image.fundebug.com/2019-08-24-upload-source-map.png)

下图为已经上传的不同版本的Source Map文件:

![](https://image.fundebug.com/2019-08-24-source-map-files.png)

若希望区分不同版本微信小程序的Source Map文件，则需要在接入Fundebug插件时，配置对应的[appversion](https://docs.fundebug.com/notifier/wxjs/customize/appversion.html)属性，与上传Source Map时设置的版本保持一致：

```javascript
fundebug.init({
    appVersion: "3.2.5"
});
```

Fundebug微信小游戏BUG监控服务的Source Map功能也将尽快推出，敬请期待。

最后，感谢青团社的小伙伴的协助~

### 参考

- [Fundebug文档： 微信小程序Source Map](https://docs.fundebug.com/notifier/wxjs/sourcemap/)
- [Source Map入门教程](https://blog.fundebug.com/2017/03/13/sourcemap-tutorial/)
