---

title: 捕获未处理的Promise错误

date: 2017-10-09 10:00:00

tags: [JavaScript, 翻译]

---

**译者按：** 通过监听**unhandledrejection**事件，可以捕获未处理的Promise错误。

<!-- more -->


- 原文: [Tracking unhandled rejected Promises](http://2ality.com/2016/04/unhandled-rejections.html)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译，并且对源代码进行了大量修改。另外，本文版权归原作者所有，翻译仅用于学习。**

使用**Promise**编写异步代码时，使用**reject**来处理错误。有时，开发者通常会忽略这一点，导致一些错误没有得到处理。例如：

```javascript
function main() {
    asyncFunc()
    .then(···)
    .then(() => console.log('Done!'));
}
```

由于没有使用**catch**方法捕获错误，当**asyncFunc()**函数**reject**时，抛出的错误则没有被处理。

这篇博客将分别介绍在浏览器与Node.js中，如何捕获那些未处理的Promise错误。

###  浏览器中未处理的Promise错误

一些浏览器(例如Chrome)能够捕获未处理的Promise错误。

#### unhandledrejection  

监听**unhandledrejection**事件，即可捕获到未处理的Promise错误：

```javascript
window.addEventListener('unhandledrejection', event => ···);
```

这个事件是**PromiseRejectionEvent**实例，它有2个最重要的属性：

- `promise`: reject的Promise
- `reason`: Promise的reject值

示例代码：

```javascript
window.addEventListener('unhandledrejection', event =>
{
    console.log(event.reason); // 打印"Hello, Fundebug!"
});

function foo()
{
    Promise.reject('Hello, Fundebug!');
}

foo();
```

[Fundebug](https://fundebug.com/)的[JavaScript](https://docs.fundebug.com/notifier/javascript/)错误监控插件监听了**unhandledrejection**事件，因此可以自动捕获未处理Promise错误。

#### rejectionhandled  

当一个Promise错误最初未被处理，但是稍后又得到了处理，则会触发**rejectionhandled**事件：

```javascript
window.addEventListener('rejectionhandled', event => ···);
```

这个事件是**PromiseRejectionEvent**实例。

示例代码：

```javascript
window.addEventListener('unhandledrejection', event =>
{
    console.log(event.reason); // 打印"Hello, Fundebug!"
});

window.addEventListener('rejectionhandled', event =>
{
    console.log('rejection handled'); // 1秒后打印"rejection handled"
});


function foo()
{
    return Promise.reject('Hello, Fundebug!');
}

var r = foo();

setTimeout(() =>
{
    r.catch(e =>{});
}, 1000);
```



### Node.js中未处理的Promise错误 

监听**unhandledRejection**事件，即可捕获到未处理的Promise错误：

```javascript
process.on('unhandledRejection', (reason, promise) => ···);
```

示例代码：

```javascript
process.on('unhandledRejection', reason =>
{
    console.log(reason); // 打印"Hello, Fundebug!"
});

function foo()
{
    Promise.reject('Hello, Fundebug!');
}

foo();
```

**注:** Node.js v6.6.0+ 默认会报告未处理的Promise错误，因此不去监听**unhandledrejection**事件也没问题。

[Fundebug](https://fundebug.com/)的[Node.js](https://docs.fundebug.com/notifier/nodejs/)错误监控插件监听了**unhandledRejection**事件，因此可以自动捕获未处理Promise错误。

### 参考

- [Promise Rejection Events Sample](https://googlechrome.github.io/samples/promise-rejection-events/)
- [Event: 'unhandledRejection'](https://nodejs.org/api/process.html#process_event_unhandledrejection)
