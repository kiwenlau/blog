---
title: Fundebug前端JavaScript插件更新至1.8.0，兼容低版本的Android浏览器

date: 2019-06-03 10:00:00

tags: [Fundebug, JavaScript]

keywords: Fundebug, JavaScript, BUG监控

description: Fundebug前端JavaScript插件更新至1.8.0，兼容低版本的Android浏览器
---

**摘要：** 兼容低版本 Android 浏览器，请大家及时更新。

![](https://image.fundebug.com/2019-06-03-fundebug-javascript-upgrade.jpg)

<!-- more -->

### Fundebug 前端 BUG 监控服务

[Fundebug](https://www.fundebug.com/)是专业的程序 BUG 监控平台，我们 JavaScript 插件可以提供全方位的 BUG 监控，可以帮助开发者第一时间定位 JavaScript 执行错误、HTTP 请求错误以及资源加载错误。并且，我们可以记录用户行为、“录制”用户操作视频，帮助开发者快速复现 BUG，提高 Debug 效率。

### 1.8.0 兼容低版本 Android 浏览器

用户和我们反馈，Fundebug 在 Android 4.4 与 5.1.1 浏览器上会报错，我们在 1.8.0 修复了这个问题，请大家及时更新插件。

通过优化 Babel 配置，我们兼容了一些低版本的浏览器：

```javascript
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "ie": 6,
                    "android": 4,
                    "ios": 8
                }
            }
        ]
    ]
}
```

可知，Fundebug 插件最低兼容 IE 6，Android 4 以及 iOS 8。注意，我们保证 Fundebug 插件在这些浏览器下不会出错，但是并无意于为低版本浏览器提供全面的 BUG 监控服务。例如，我们的录屏功能仅支持一些高版本的浏览器，IE 6 ~ IE 10 均不支持。

最后，感谢 Fundebug 用户**闁鑅**与**疯狂紫萧**的反馈。

### 参考

-   [Fundebug 录屏插件更新至 0.4.0，修复 BUG，优化性能](https://blog.fundebug.com/2019/05/26/fundebug-release-revideo-0-4-0/)
-   [Fundebug 文档 - JavaScript 插件版本](https://docs.fundebug.com/notifier/javascript/version.html)
