---

title: 重构：从Promise到Async/Await

date: 2017-12-13 10:00:00

tags: [JavaScript, Node.js, 原创]

---

**摘要：** 夸张点说，技术的发展与历史一样，顺之者昌，逆之者亡。JS开发者们，赶紧拥抱Async/Await吧！

<!-- more -->

- **GitHub仓库:** [Fundebug/promise-asyncawait](https://github.com/Fundebug/promise-asyncawait)

早在半年多之前，我就在鼓吹[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)，似乎还招致了一些[批评](https://cnodejs.org/topic/58e4914e43ee7e7106c13541)。然而，直到最近，我才真正开始进行代码重构，抛弃Promise，全面使用Async/Await。因为，[Node 8终于LTS了](https://nodejs.org/en/blog/release/v8.9.0/)！


### Async/Await真的比Promise好吗？

**是的是的。**

这些天，我大概重构了1000行代码，最大的感觉是代码简洁了很多：

- 真正地用同步的方式写异步代码
- 不用写then及其回调函数，减少代码行数，也避免了代码嵌套
- 所有异步调用可以写在同一个代码块中，无需定义多余的中间变量
- async函数会隐式地返回一个Promise，因此可以直接return变量，无需使用Promise.resolve进行转换

下面，我们可以通过一个非常简单的示例来体验一下Async/Await的酸爽：

#### 示例1

```javascript
const Promise = require("bluebird")
var readFile = Promise.promisify(require("fs").readFile)

// 使用Promise
function usePromise()
{
    let a
    readFile("a.txt", "utf8")
        .then(tmp =>
        {
            a = tmp
            return readFile("b.txt", "utf8")
        })
        .then(b =>
        {
            let result = a + b
            console.log(result) // 输出"Hello, Fundebug!"
        })

}

// 使用Async/Await
async function useAsyncAwait()
{
    let a = await readFile("a.txt", "utf8")
    let b = await readFile("b.txt", "utf8")
    let result = a + b
    console.log(result) // 输出"Hello, Fundebug!"
}

usePromise()
useAsyncAwait()
```

由示例可知，使用Async/Await极大地简化了代码，使得代码可读性提高了非常多。

### Async/Await真的替代了Promise？

**是的是的。**

对于[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)，批评者执着于Async/Await是基于Promise实现的，因此**替代**这个词不准确，这就有点尴尬了。

一方面，这里替代的是**异步代码的编写方式**，并非完全抛弃大家心爱的**Promise**，地球人都知道Async/Await是基于Promise的，不用太伤心；另一方面，**Promise**是基于**回调函数**实现的，那**Promise**也没有替代**回调函数**咯？

重构代码之后，我仍然用到了Promise库[bluebird](http://bluebirdjs.com/docs/getting-started.html)。"Talk is cheap, Show me the code!"，大家不妨看看两个示例。

#### 示例2：Promise.promisify

使用[Promise.promisify](http://bluebirdjs.com/docs/api/promise.promisify.html)将不支持**Promise**的方法Promise化，调用异步接口的时候有两种方式：

```javascript
const Promise = require("bluebird")
var readFile = Promise.promisify(require("fs").readFile)

// 使用Promise
function usePromise()
{
    readFile("b.txt", "utf8")
        .then(b =>
        {
            console.log(b)
        })
}

// 使用Async/Await
async function useAsyncAwait()
{
    var b = await readFile("b.txt", "utf8")
    console.log(b) // 输出"Fundebug!"
}

usePromise()
useAsyncAwait()
```

*[Fundebug](https://fundebug.com)是全栈JavaScript错误监控平台，支持各种前端和后端框架，可以帮助您第一时间发现BUG！*

#### 示例3：Promise.map

使用[Promise.map](http://bluebirdjs.com/docs/api/promise.map.html)读取多个文件的数据，调用异步接口的时候有两种方式：

```javascript
const Promise = require("bluebird")
var readFile = Promise.promisify(require("fs").readFile)
var files = ["a.txt", "b.txt"]

// 使用Promise
function usePromise()
{
    Promise.map(files, file =>
        {
            return readFile(file, "utf8")
        })
        .then(results =>
        {
            console.log(results)
        })
}

// 使用Async/Await
async function useAsyncAwait()
{
    var results = await Promise.map(files, file =>
    {
        return readFile(file, "utf8")
    })
    console.log(results)
}

usePromise()
useAsyncAwait()
```

没错，我的确使用了Promise库，readFile与Promise.map都是Promise函数。但是，在调用readFile与Promise.map函数时，使用Async/Await与使用Promise是两种不同写法，它们是相互替代的关系。

### Async/Await有什么问题吗？

**有啊有啊。**

使用了**await**的函数定义时要加一个**async**，调用异步函数的时候需要加一个**await**，这玩意写多了也觉着烦，有时候还容易忘掉。不写**async**代码直接报错，不写**await**代码执行会出错。

#### 示例4

```javascript
const Promise = require("bluebird")
var readFile = Promise.promisify(require("fs").readFile)

// 没有Async
function withoutAsync()
{
    let b = await readFile("b.txt", "utf8") // 报错"SyntaxError: Unexpected identifier"
    console.log(b) 
}

// 没有await
async function withoutAwait()
{
    let b = readFile("b.txt", "utf8")
    console.log(b) // 打印"Promise..."
}

withoutAsync()
withoutAwait()
```

既然Async/Await写着有点添乱，可不可以不写呢？我想以后应该是可以的，只要能够自动识别异步代码就行了，这应该也是未来的发展方向。至于说如何实现，那我就不知道了哎。


### 总结

JavaScript的异步编写方式，从回调函数到Promise再到Async/Await，表面上只是写法的变化，本质上则是语言层的一次次抽象，让我们可以**用更简单的方式实现同样的功能**，而程序员不需要去考虑代码是如何执行的。在我看来，这样的进步应该不会停止，有一天我们也许不用写Async/Await了！

### 参考

- [Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)
- [Async/Await是这样简化JavaScript代码的](https://blog.fundebug.com/2017/10/16/async-await-simplify-javascript/)




<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>