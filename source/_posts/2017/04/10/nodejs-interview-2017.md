---
title: Node.js面试题之2017

date: 2017-04-10 12:00:00

tags: [Node.js, JavaScript, 翻译]
---

**译者按:** 从**ECMAScript标准**，**Node.js语法**以及**NPM模块**角度来看，Node.js的发展让人目不暇接，那么面试题也得与时俱进。


<!-- more -->

原文: [Node.js Interview Questions and Answers (2017 Edition)](https://blog.risingstack.com/node-js-interview-questions-and-answers-2017/)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

### 问题

- 什么是错误优先的回调函数？
- 如何避免回调地狱？
- 什么是Promise?
- 用什么工具保证一致的代码风格？为什么要这样？
- 什么是Stub?举例说明
- 什么是测试金字塔？举例说明
- 最喜欢哪个HTTP框架？为什么？
- Cookies如何防范XSS攻击？
- 如何保证依赖的安全性？

### 答案

#### 1. 什么是错误优先的回调函数？

错误优先的回调函数(Error-First Callback)用于同时返回错误和数据。第一个参数返回错误，并且验证它是否出错；其他参数用于返回数据。

```javascript
fs.readFile(filePath, function(err, data)
{
    if (err)
    {
        // 处理错误
        return console.log(err);
    }
    console.log(data);
});
```

#### 2. 如何避免回调地狱？

以下方式可以避免回调地狱:

- 模块化: 将回调函数转换为独立的函数
- 使用流程控制库，例如[aync](https://www.npmjs.com/package/async)
- 使用Promise
- 使用aync/await(参考[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/))

#### 3. 什么是Promise?

Promise可以帮助我们更好地处理异步操作。下面的示例中，100ms后会打印result字符串。**catch**用于错误处理。多个Promise可以链接起来。

```javascript
new Promise((resolve, reject) =>
    {
        setTimeout(() =>
        {
            resolve('result');
        }, 100)
    })
    .then(console.log)
    .catch(console.error);
```

#### 4. 用什么工具保证一致的代码风格？为什么要这样？

团队协作时，保证一致的代码风格是非常重要的，这样团队成员才可以更快地修改代码，而不需要每次去适应新的风格。这些工具可以帮助我们:

- [ESLint](http://eslint.org/)
- [Standard](https://standardjs.com/)

感兴趣的话，可以参考[JavaScript Clean Coding](https://blog.risingstack.com/javascript-clean-coding-best-practices-node-js-at-scale/)

#### 5. 什么是Stub?举例说明

Stub用于模拟模块的行为。测试时，Stub可以为函数调用返回模拟的结果。比如说，当我们写文件时，实际上并不需要真正去写。

```javascript
var fs = require('fs');

var writeFileStub = sinon.stub(fs, 'writeFile', function(path, data, cb)
{
    return cb(null);
});

expect(writeFileStub).to.be.called;
writeFileStub.restore();
```

#### 6. 什么是测试金字塔？举例说明

测试金字塔反映了需要写的**单元测试**、**集成测试**以及**端到端测试**的比例:

<div style="text-align: left;">
<img style="width:30%;" src="nodejs-interview-2017/test_pyramid.png" />
</div>

测试HTTP接口时应该是这样的:

- 很多单元测试，分别测试各个模块(依赖需要stub)
- 较少的集成测试，测试各个模块之间的交互(依赖不能stub)
- 少量端到端测试，去调用真正地接口(依赖不能stub)

#### 7. 最喜欢哪个HTTP框架？为什么？

这个问题标准答案。需要描述框架的优缺点，这样可以反映开发者对框架的熟悉程度。

#### 8. Cookies如何防范XSS攻击？

XSS(Cross-Site Scripting，跨站脚本攻击)是指攻击者在返回的HTML中插入JavaScript脚本。为了减轻这些攻击，需要在HTTP头部配置**set-cookie**:

- HttpOnly - 这个属性可以防止**cross-site scripting**，因为它会禁止Javascript脚本访问cookie。
- secure - 这个属性告诉浏览器仅在请求为HTTPS时发送cookie。

结果应该是这样的: **Set-Cookie: sid=<cookie-value>; HttpOnly**. 使用Express的话，[cookie-session](https://github.com/expressjs/cookie-session#cookie-options)默认配置好了。

#### 9. 如何保证依赖的安全性？

编写Node.js应用时，很可能依赖成百上千的模块。例如，使用了Express的话，会直接依赖[27个模块](https://github.com/expressjs/express/blob/master/package.json#L29)。因此，手动检查所有依赖是不现实的。唯一的办法是对依赖进行自动化的安全检查，有这些工具可供选择:

- npm outdated
- [Trace by RisingStack](https://trace.risingstack.com/)
- [NSP](https://nodesecurity.io/)
- [GreenKeeper](https://greenkeeper.io/)
- [Snyk](https://snyk.io/)

### 附加题

#### 1. 这段代码有什么问题？

```javascript
new Promise((resolve, reject) =>
    {
        throw new Error('error')
    })
    .then(console.log)
```



**then**之后没有**catch**。这样的话，错误会被忽略。可以这样解决问题:

```javascript
new Promise((resolve, reject) =>
    {
        throw new Error('error')
    })
    .then(console.log).catch(console.error)
```



调试一个大型的项目时，可以使用监控**unhandledRejection**事件来捕获所有未处理的Promise错误:

```javascript
process.on('unhandledRejection', (err) =>
{
    console.log(err)
})
```

------

### 2. 这段代码有什么问题？

```javascript
function checkApiKey(apiKeyFromDb, apiKeyReceived)
{
    if (apiKeyFromDb === apiKeyReceived)
    {
        return true
    }
    return false
}
```

比较密码时，不能泄露任何信息，因此比较必须在固定时间完成。否则，可以使用[timing attacks](https://en.wikipedia.org/wiki/Timing_attack)来攻击你的应用。**为什么会这样呢**?Node.js使用V8引擎，它会从性能角度优化代码。它会逐个比较字符串的字母，一旦发现不匹配时就停止比较。当攻击者的密码更准确时，比较的时间越长。因此，攻击者可以通过比较的时间长短来判断密码的正确性。使用[cryptiles](https://www.npmjs.com/package/cryptiles)可以解决这个问题:

```javascript
function checkApiKey(apiKeyFromDb, apiKeyReceived)
{
    return cryptiles.fixedTimeComparison(apiKeyFromDb, apiKeyReceived)
}
```

### 3. 这段代码的输出是什么？

```javascript
Promise.resolve(1)  
  .then((x) => x + 1)
  .then((x) => { throw new Error('My Error') })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch(console.error)
```

答案是2，逐行解释如下:

1. 创建新的Promise，resolve值为1。
2. x为1，加1之后返回2。
3. x为2，但是没有用到。抛出一个错误。
4. 捕获错误，但是没有处理。返回1。
5. x为1，加1之后返回2。
6. x为2，打印2。
7. 不会执行，因为没有错误抛出。


### 参考链接

- [10个常见的Node.js面试题](http://wwsun.github.io/posts/nodejs-interview-questions.html)
- [XSS - Stealing Cookies 101](http://jehiah.cz/a/xss-stealing-cookies-101)
