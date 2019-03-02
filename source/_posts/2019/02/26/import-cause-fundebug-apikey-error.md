---
title: import 提升导致 Fundebug 报错：“请配置 apikey”

date: 2019-02-26 10:00:00

tags: [产品]

keywords: Fundenbug, JavaScript, import

description: import 提升导致 Fundebug 报错：“请配置 apikey”
---

**摘要：** 解释一下“请配置 apikey”报错的原因。

<!-- more -->

部分 Fundebug 用户使用 import 来导入 js 文件时，出现了"请配置 apikey"的报错，这是由于 import 提升导致的，下面我会详细解释一下这一点。

### import 提升

关于 import 提升，我们可以参考阮一峰的[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)。

import 命令具有提升效果，会提升到整个模块的头部，首先执行。

```javascript
foo();

import { foo } from "my_module";
```

上面的代码不会报错，因为 import 的执行早于 foo 的调用。这种行为的本质是，import 命令是编译阶段执行的，在代码运行之前。

因此，**即使我们把 import 语句写在后面，它仍然会在其他语句之前执行**。

### import 提升为何导致 Fundebug 报错？

[Fundebug](https://www.fundebug.com/)用户应该清楚，在接入[fundebug-javascript](https://www.npmjs.com/package/fundebug-javascript)插件之后，需要配置 apikey，如下：

```javascript
import * as fundebug from "fundebug-javascript";
fundebug.apikey = "API-KEY";
```

假设我们还需要 import 一个**test.js**文件，这个文件会抛出一个 Error，如下：

```javascript
// test.js
throw new Error("test");
```

一切看起来没有问题：

```javascript
// main.js
import * as fundebug from "fundebug-javascript";
fundebug.apikey = "API-KEY";
import "./test";
```

但是，根据 import 提升，代码的实际执行顺序如下：

```javascript
// main.js
import * as fundebug from "fundebug-javascript";
import "./test";
fundebug.apikey = "API-KEY";
```

这种情况下，第二行代码就会抛出错误，导致 apikey 复制语句不会执行，从而导致报错：“请配置 apikey”。

### 这个问题并不需要解决

出于测试的目的，用户会去 import 一个立即报错的 js 文件，类似于前文提到的 test.js。但是实际开发中，我们不可能这样做，否则应用会立即崩溃，更谈不上部署了。

我们写这篇博客的目的仅仅是解释一下原因，并分享一个非常简单的知识点“import 提升”。

### 如何规避这个问题?

**仅供参考，实际上没有必要这样做。**

新建一个配置文件**config.js**，在这个文件中配置 apikey：

```javascript
fundebug.apikey = "API-KEY";
```

import 配置文件：

```javascript
// main.js
import * as fundebug from "fundebug-javascript";
import "./config";
import "./test";
```

这种情况下，配置 apikey 的语句被 import 代替了，也就不存在所谓"import 提升"的问题，Fundebug 将可以正常报错。

最后，感谢 Fundebug 用户**龙哥**的反馈和协助！

### 参考

-   [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)
-   [Fundebug 文档 - JavaScript 错误监控插件](https://docs.fundebug.com/notifier/javascript/)
