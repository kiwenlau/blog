---
title: 理解Promise的3种姿势

date: 2017-09-25 10:00:00

tags: [JavaScript, 翻译]

---

**译者按：** 对于[**Promise**](http://exploringjs.com/es6/ch_promises.html)，也许你会用了，却并不理解；也许你理解了，却只可意会不可言传。这篇博客将从3个简单的视角理解**Promise**，应该对你有所帮助。

<!-- more -->


- 原文: [Three ways of understanding Promises](http://2ality.com/2016/10/understanding-promises.html)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译，并且对源代码进行了大量修改。另外，本文版权归原作者所有，翻译仅用于学习。**

**示例1**中，**asyncFunc()**函数返回的是一个**Promise**实例:

```javascript
// 示例1
function asyncFunc()
{
    return new Promise(function(resolve, reject)
    {
        setTimeout(function()
        {
            resolve('Hello, Fundebug!');
        }, 100);
    });
}

asyncFunc()
    .then(function(x)
    {
        console.log(x); // 1秒之后打印"Hello, Fundebug!"
    });
```

1秒之后，**Promise**实例的状态变为**resolved**，就会触发**then**绑定的回调函数，打印**resolve值**，即"Hello, Fundebug!"。

那么，什么是**Promise**呢？

- **Promise**调用是阻塞的
- **Promise**中保存了异步操作结果
- **Promise**是一个事件

### **Promise**调用是阻塞的

**示例2**可以帮助我们理解**阻塞**：

```javascript
// 示例2
function asyncFunc()
{
    return new Promise(function(resolve, reject)
    {
        setTimeout(function()
        {
            resolve('Hello, Fundebug!');
        }, 1000);
    });
}

async function main()
{
    const x = await asyncFunc(); // (A)
    console.log(x); // (B) 1秒之后打印"Hello, Fundebug!"
}

main();
```

以上代码是采用[Async/Await](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)语法写的，与**示例1**完全等价。**await**的中文翻译即为"等待"，这里可以"望文生义"。因此，相比于使用**Promise**实现，它更加直观地展示了什么是**阻塞**。

- (A)行: 等待**asyncFunc()**执行，直到它返回结果，并赋值给变量**x**
- (B)行: 打印**x**；

事实上，使用**Promise**实现时，也需要等待**asyncFunc()**执行，之后再调用**then**绑定的回调函数。因此，调用**Promise**时，代码也是阻塞的。

### Promise中保存了异步操作结果

如果某个函数返回**Promise**实例，则这个**Promise**最初相当于一个空白的容器，当函数执行结束时，其结果将会放进这个容器。**示例3**通过数组模拟了这个过程：

```javascript
// 示例3
function asyncFunc()
{
    const blank = [];
    setTimeout(function()
    {
        blank.push('Hello, Fundebug!');
    }, 1000);
    return blank;
}

const blank = asyncFunc();

console.log(blank);  // 打印"[]"

setTimeout(function()
{
    const x = blank[0]; // (A)
    console.log(x); // 2秒之后打印"Hello, Fundebug!"
}, 2000);
```

开始时，**blank**为空数组，1秒之后，"Hello, Fundebug!"被添加到数组中，为了确保成功，我们需要在2秒之后从**blank**数组中读取结果。

对于**Promise**，我们不需要通过数组或者其他变量来传递结果，**then**所绑定的回调函数可以通过参数获取函数执行的结果。

### Promise是一个事件

**示例4**模拟了事件:

```javascript
// 示例4
function asyncFunc()
{
    const eventEmitter = {
        success: []
    };

    setTimeout(function()
    {
        for (const handler of eventEmitter.success)
        {
            handler('Hello, Fundebug!');
        }
    }, 1000);

    return eventEmitter;
}

asyncFunc()
    .success.push(function(x)
    {
        console.log(x); // 1秒之后打印"Hello, Fundebug!"
    });
```

调用**asyncFunc()**之后，**sucesss**数组其实是空的，将回调函数push进数组，相当于绑定了事件的回调函数。1秒之后，**setTimeout**定时结束，则相当于事件触发了，这时**sucess**数组中已经注册了回调函数，于是打印"Hello, Fundebug!"。

当**Promise**成功**resolve**时，会触发**then**所绑定的回调函数，这其实就是事件。

### 参考  

- [Promises for asynchronous programming](http://exploringjs.com/es6/ch_promises.html)
- [Async functions](http://exploringjs.com/es2016-es2017/ch_async-functions.html)
- [ECMAScript 6 入门 - Promise对象](http://es6.ruanyifeng.com/#docs/promise)

